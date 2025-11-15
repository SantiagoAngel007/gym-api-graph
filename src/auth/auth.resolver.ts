import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './entities/users.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { LoginInput } from './dto/login.dto';
import { ObjectType, Field } from '@nestjs/graphql';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { ValidRoles } from './enums/roles.enum';
import { AddRoleInput, RemoveRoleInput } from './dto/manage-role.dto';

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Mutaciones públicas (sin autenticación)
  @Mutation(() => AuthResponse)
  async signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    const result = await this.authService.create(createUserInput);
    return {
      token: result.token,
      user: result,
    };
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const result = await this.authService.login(loginInput);
    return {
      token: result.token,
      user: result,
    };
  }

  // Queries protegidas - Requieren autenticación
  @Query(() => User, {
    name: 'me',
    description: 'Get current authenticated user profile',
  })
  @Auth()
  async me(@GetUser() user: User) {
    return this.authService.findOne(user.id);
  }

  @Query(() => User, {
    name: 'user',
    description: 'Get user by ID - Only authenticated users can view other users',
  })
  @Auth()
  async user(@Args('id') id: string) {
    return this.authService.findOne(id);
  }

  @Query(() => [User], {
    name: 'users',
    description: 'Get all users - Only authenticated users can view user list',
  })
  @Auth()
  async users() {
    return this.authService.findAll();
  }

  // Mutaciones protegidas - Solo admin puede crear/modificar/eliminar usuarios
  @Mutation(() => User, {
    name: 'updateUser',
    description:
      'Update user - Admins can update any user, users can only update themselves',
  })
  @Auth()
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetUser() authUser: User,
  ) {
    return this.authService.update(
      updateUserInput.id,
      updateUserInput,
      authUser,
    );
  }

  @Mutation(() => Boolean, {
    name: 'removeUser',
    description: 'Delete user - Only admins can delete users',
  })
  @Auth(ValidRoles.admin)
  async removeUser(@Args('id') id: string) {
    await this.authService.remove(id);
    return true;
  }

  @Mutation(() => User, {
    name: 'addRoleToUser',
    description: 'Add a role to a user - Only admins can manage roles',
  })
  @Auth(ValidRoles.admin)
  async addRoleToUser(@Args('addRoleInput') addRoleInput: AddRoleInput) {
    return this.authService.addRole(addRoleInput.userId, addRoleInput.roleName);
  }

  @Mutation(() => User, {
    name: 'removeRoleFromUser',
    description: 'Remove a role from a user - Only admins can manage roles',
  })
  @Auth(ValidRoles.admin)
  async removeRoleFromUser(
    @Args('removeRoleInput') removeRoleInput: RemoveRoleInput,
  ) {
    return this.authService.removeRole(
      removeRoleInput.userId,
      removeRoleInput.roleName,
    );
  }
}
