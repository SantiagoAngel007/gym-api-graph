import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ValidRoles } from '../enums/roles.enum';

@InputType()
export class AddRoleInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsEnum(ValidRoles)
  @IsNotEmpty()
  roleName: ValidRoles;
}

@InputType()
export class RemoveRoleInput {
  @Field()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsEnum(ValidRoles)
  @IsNotEmpty()
  roleName: ValidRoles;
}

export class AddRoleDto extends AddRoleInput {}
export class RemoveRoleDto extends RemoveRoleInput {}
