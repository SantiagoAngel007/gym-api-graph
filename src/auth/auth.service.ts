import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcryptjs');
import { LoginDto } from './dto/login.dto';
import { Jwt } from './interfaces/jwt.interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from './entities/roles.entity';
import { ValidRoles } from './enums/roles.enum';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    public readonly roleRepository: Repository<Role>,
    public readonly jwtService: JwtService,
    @Inject(forwardRef(() => SubscriptionsService))
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    const user = this.userRepository.create({
      ...userData,
      password: this.encryptPassword(password),
    });

    const defaultRole = await this.roleRepository.findOneBy({
      name: ValidRoles.client,
    });
    if (!defaultRole) {
      throw new InternalServerErrorException(
        'Rol por defecto "client" no encontrado',
      );
    }
    user.roles = [defaultRole];

    try {
      await this.userRepository.save(user);

      // Crear subscripción vacía automáticamente
      try {
        await this.subscriptionsService.createSubscriptionForUser(user.id);
      } catch (subscriptionError) {
        // Logueamos el error para verlo en la consola con todos sus detalles
        this.logger.error(
          `FATAL: Failed to create subscription for user ${user.id}. Registration aborted.`,

          subscriptionError.stack, // El .stack da mucha más información
        );
        // Volvemos a lanzar el error para que la petición falle y veamos el problema
        throw subscriptionError;
      }

      // Recargar el usuario con los roles cargados
      const userWithRoles = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['roles'],
      });

      if (!userWithRoles) {
        throw new InternalServerErrorException(
          'User created but not found after creation',
        );
      }

      delete userWithRoles.password;
      return {
        ...userWithRoles,
        token: this.getJwtToken({ id: userWithRoles.id, email: userWithRoles.email }),
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        age: true,
        isActive: true,
      },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }

    if (!bcrypt.compareSync(password, user.password || '')) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id, email: user.email }),
    };
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({
        relations: ['roles'],
      });
      return users.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = user;
        return safeUser;
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    delete user.password;
    return user;
  }

  async update(
    idToUpdate: string,
    updateUserDto: UpdateUserDto,
    authUser: User,
  ) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id: idToUpdate },
      relations: ['roles'],
    });

    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${idToUpdate} not found`);
    }

    const isAdmin = authUser.roles.some(
      (role) => role.name === String(ValidRoles.admin),
    );

    if (!isAdmin && authUser.id !== idToUpdate) {
      throw new ForbiddenException(
        `You can only update your own profile. You cannot update other users.`,
      );
    }

    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      const existingUser = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });
      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = this.encryptPassword(updateUserDto.password);
    }

    try {
      await this.userRepository.update(idToUpdate, updateUserDto);
      const updatedUser = await this.userRepository.findOne({
        where: { id: idToUpdate },
        relations: ['roles'],
      });

      if (!updatedUser) {
        throw new InternalServerErrorException(
          'User updated but not found after update',
        );
      }

      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isAdmin = user.roles.some((role) => role.name === 'admin');
    if (isAdmin) {
      const adminCount = await this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.roles', 'role')
        .where('role.name = :role', { role: 'admin' })
        .getCount();

      if (adminCount <= 1) {
        throw new BadRequestException('Cannot delete the last admin user');
      }
    }

    try {
      // Limpiar las relaciones de roles antes de eliminar el usuario
      user.roles = [];
      await this.userRepository.save(user);

      // Ahora eliminar el usuario
      await this.userRepository.remove(user);
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  async addRole(userId: string, roleName: ValidRoles) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const role = await this.roleRepository.findOneBy({ name: roleName });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    // Verificar si el usuario ya tiene este rol
    const hasRole = user.roles.some((r) => r.name === roleName);
    if (hasRole) {
      throw new BadRequestException(
        `User already has the role ${roleName}`,
      );
    }

    user.roles.push(role);
    await this.userRepository.save(user);

    // Recargar el usuario con los roles actualizados
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'User updated but not found after update',
      );
    }

    delete updatedUser.password;
    return updatedUser;
  }

  async removeRole(userId: string, roleName: ValidRoles) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verificar si el usuario tiene este rol
    const hasRole = user.roles.some((r) => r.name === roleName);
    if (!hasRole) {
      throw new BadRequestException(`User does not have the role ${roleName}`);
    }

    // No permitir quitar el último rol
    if (user.roles.length === 1) {
      throw new BadRequestException(
        'Cannot remove the last role from a user. Users must have at least one role.',
      );
    }

    // No permitir quitar el rol de admin si es el último admin
    if (roleName === ValidRoles.admin) {
      const adminCount = await this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.roles', 'role')
        .where('role.name = :role', { role: 'admin' })
        .getCount();

      if (adminCount <= 1) {
        throw new BadRequestException(
          'Cannot remove admin role from the last admin user',
        );
      }
    }

    user.roles = user.roles.filter((r) => r.name !== roleName);
    await this.userRepository.save(user);

    // Recargar el usuario con los roles actualizados
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'User updated but not found after update',
      );
    }

    delete updatedUser.password;
    return updatedUser;
  }

  encryptPassword(password: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return bcrypt.hashSync(password, 10);
  }

  private getJwtToken(payload: Jwt): string {
    return this.jwtService.sign(payload);
  }

  private handleException(error: any): never {
    this.logger.error(error);

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
