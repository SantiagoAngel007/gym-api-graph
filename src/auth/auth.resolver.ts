import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from './entities/users.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { LoginInput } from './dto/login.dto';
import { ObjectType, Field } from '@nestjs/graphql';

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

  @Query(() => User)
  async me(@Args('id') id: string) {
    return this.authService.findOne(id);
  }
}
