import { PartialType } from '@nestjs/mapped-types';
import { PartialType as GraphQLPartialType } from '@nestjs/graphql';
import { CreateUserDto, CreateUserInput } from './create-user.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';

// GraphQL Input Type
@InputType()
export class UpdateUserInput extends GraphQLPartialType(CreateUserInput) {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// REST DTO
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Defines if the user is active or inactive in the system.',
    example: false,
    required: false, // Indicates that this field is optional
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
