import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from './roles.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  @Field()
  email: string;

  @Column('text')
  @Field()
  fullName: string;

  @Column('int')
  @Field(() => Int)
  age: number;

  @Column('text')
  password?: string;

  @Column('bool', { default: true })
  @Field()
  isActive: boolean;

  @OneToMany('Subscription', 'user', { eager: false })
  subscriptions: any[];

  @OneToMany('Attendance', 'user', { eager: false })
  attendances: any[];

  @ManyToMany(() => Role, { eager: false })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBeforeChanges() {
    this.email = this.email.toLowerCase().trim();
  }
}
