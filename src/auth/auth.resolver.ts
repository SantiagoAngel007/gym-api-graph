import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './entities/users.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { LoginInput } from './dto/login.dto';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(@Args('createUserInput') createUserInput: CreateUserInput) {
    const user = await this.authService.create(createUserInput);
    const access_token = await this.authService.getJwtToken({ id: user.id });
    return {
      access_token,
      user,
    };
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const user = await this.authService.login(loginInput);
    const access_token = await this.authService.getJwtToken({ id: user.id });
    return {
      access_token,
      user,
    };
  }

  @Query(() => User)
  async me(@Args('token') token: string) {
    return this.authService.validateUserByToken(token);
  }
}
