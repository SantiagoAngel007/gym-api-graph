import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(120)
  age: number;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;
}

// Keep the DTO for backwards compatibility if needed
export class CreateUserDto extends CreateUserInput {}
