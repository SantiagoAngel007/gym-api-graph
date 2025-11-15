import {
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn
} from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column('text', { unique: true })
  @Field()
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  @Field(() => Float)
  cost: number;

  @Column('int')
  @Field(() => Int)
  max_classes_assistance: number;

  @Column('int')
  @Field(() => Int)
  max_gym_assistance: number;

  @Column('int')
  @Field(() => Int)
  duration_months: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  purchase_date: Date;

  @Column('bool', { default: true })
  @Field()
  isActive: boolean;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @ManyToOne('User', 'subscriptions', { onDelete: 'CASCADE' })
  user: any;

  @ManyToMany('Membership', { eager: false })
  @JoinTable({
    name: 'subscription_memberships',
    joinColumn: { name: 'subscriptionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'membershipId', referencedColumnName: 'id' },
  })
  memberships: any[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
