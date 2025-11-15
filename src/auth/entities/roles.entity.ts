import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import type { User } from './users.entity';
import { User as UserEntity } from './users.entity';
import { ValidRoles } from '../enums/roles.enum';
import { ObjectType, Field } from '@nestjs/graphql';

@Entity('roles')
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  @Field()
  name: ValidRoles;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: User[];
}
