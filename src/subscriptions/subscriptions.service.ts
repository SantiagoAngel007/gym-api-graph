import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Membership } from '../memberships/entities/membership.entity';
import { User } from '../auth/entities/users.entity';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AddMembershipDto } from './dto/add-membership.dto';
import { ValidRoles } from '../auth/enums/roles.enum';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Encuentra la subscripción de un usuario por su ID
   */
  async findSubscriptionByUserId(userId: string): Promise<Subscription> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user', 'memberships'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found for this user');
    }

    return subscription;
  }

  /**
   * Verifica si un usuario tiene una subscripción activa
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const activeSubscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: userId },
        isActive: true,
      },
    });

    return !!activeSubscription;
  }

  /**
   * Crea una subscripción para un usuario
   */
  async createSubscriptionForUser(userId: string): Promise<Subscription> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar si el usuario ya tiene una subscripción activa
    const hasActive = await this.hasActiveSubscription(userId);

    if (hasActive) {
      throw new ConflictException(
        'El usuario ya tiene una subscripción activa. Debe esperar a que caduque antes de adquirir una nueva.',
      );
    }

    // Crear nueva subscripción vacía (sin membresías inicialmente)
    const newSubscription = this.subscriptionRepository.create({
      name: `Subscription for ${user.fullName}`,
      cost: 0,
      max_classes_assistance: 0,
      max_gym_assistance: 0,
      duration_months: 0,
      purchase_date: new Date(),
      isActive: true,
      user,
      memberships: [],
    });

    return await this.subscriptionRepository.save(newSubscription);
  }

  /**
   * Agrega una membresía a una subscripción existente
   */
  async addMembershipToSubscription(
    subscriptionId: string,
    addMembershipDto: AddMembershipDto,
  ): Promise<Subscription> {
    const { membershipId } = addMembershipDto;

    // Buscar la membresía plantilla
    const membershipTemplate = await this.membershipRepository.findOne({
      where: { id: membershipId },
    });

    if (!membershipTemplate) {
      throw new NotFoundException('Membership not found');
    }

    // Buscar la subscripción
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['memberships'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Agregar la membresía a la subscripción
    subscription.memberships.push(membershipTemplate);

    // Actualizar los valores de la subscripción con los de la nueva membresía
    subscription.cost =
      Number(subscription.cost) + Number(membershipTemplate.cost);
    subscription.max_classes_assistance =
      Number(subscription.max_classes_assistance) +
      Number(membershipTemplate.max_classes_assistance);
    subscription.max_gym_assistance =
      Number(subscription.max_gym_assistance) +
      Number(membershipTemplate.max_gym_assistance);
    subscription.duration_months = Math.max(
      subscription.duration_months,
      membershipTemplate.duration_months,
    );

    return await this.subscriptionRepository.save(subscription);
  }

  /**
   * Obtiene todas las subscripciones
   */
  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      relations: ['user', 'memberships'],
    });
  }

  /**
   * Obtiene una subscripción por ID
   * Valida que solo el dueño o un admin puedan acceder
   */
  async findOne(id: string, authUser?: User): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'memberships'],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    // Si se proporciona un usuario autenticado, validar permisos
    if (authUser) {
      const isAdmin = authUser.roles.some(
        (role) => role.name === String(ValidRoles.admin),
      );
      const isOwner = subscription.user.id === authUser.id;

      if (!isAdmin && !isOwner) {
        throw new ForbiddenException(
          'You can only access your own subscriptions',
        );
      }
    }

    return subscription;
  }

  /**
   * Actualiza una subscripción
   * Valida que solo el dueño o un admin puedan modificar
   */
  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
    authUser: User,
  ): Promise<Subscription> {
    const subscription = await this.findOne(id);

    // Validar permisos
    const isAdmin = authUser.roles.some(
      (role) => role.name === String(ValidRoles.admin),
    );
    const isOwner = subscription.user.id === authUser.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'You can only update your own subscriptions',
      );
    }

    // Si se están actualizando las membresías, hay que cargarlas
    if (updateSubscriptionDto.membershipIds) {
      const memberships = await this.membershipRepository.findByIds(
        updateSubscriptionDto.membershipIds,
      );

      if (memberships.length !== updateSubscriptionDto.membershipIds.length) {
        throw new NotFoundException('One or more memberships not found');
      }

      subscription.memberships = memberships;
    }

    // Actualizar los demás campos (filtrando undefined)
    const updateData = Object.fromEntries(
      Object.entries(updateSubscriptionDto).filter(
        ([_, value]) => value !== undefined,
      ),
    );
    Object.assign(subscription, updateData);

    return await this.subscriptionRepository.save(subscription);
  }

  /**
   * Desactiva una subscripción (cuando expira o se cancela)
   * Valida que solo el dueño o un admin puedan desactivar
   */
  async deactivateSubscription(
    id: string,
    authUser: User,
  ): Promise<Subscription> {
    const subscription = await this.findOne(id);

    // Validar permisos
    const isAdmin = authUser.roles.some(
      (role) => role.name === String(ValidRoles.admin),
    );
    const isOwner = subscription.user.id === authUser.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'You can only deactivate your own subscriptions',
      );
    }

    subscription.isActive = false;

    return await this.subscriptionRepository.save(subscription);
  }

  /**
   * Activa una subscripción
   * Valida que solo el dueño o un admin puedan activar
   */
  async activateSubscription(id: string, authUser: User): Promise<Subscription> {
    const subscription = await this.findOne(id);

    // Validar permisos
    const isAdmin = authUser.roles.some(
      (role) => role.name === String(ValidRoles.admin),
    );
    const isOwner = subscription.user.id === authUser.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'You can only activate your own subscriptions',
      );
    }

    // Verificar si el usuario ya tiene otra subscripción activa
    const hasActive = await this.hasActiveSubscription(subscription.user.id);

    if (hasActive) {
      throw new ConflictException(
        'El usuario ya tiene una subscripción activa.',
      );
    }

    subscription.isActive = true;

    return await this.subscriptionRepository.save(subscription);
  }

  /**
   * Elimina una subscripción (soft delete)
   * Valida que solo el dueño o un admin puedan eliminar
   */
  async remove(id: string, authUser: User): Promise<void> {
    const subscription = await this.findOne(id);

    // Validar permisos
    const isAdmin = authUser.roles.some(
      (role) => role.name === String(ValidRoles.admin),
    );
    const isOwner = subscription.user.id === authUser.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'You can only delete your own subscriptions',
      );
    }

    await this.subscriptionRepository.softRemove(subscription);
  }
}
