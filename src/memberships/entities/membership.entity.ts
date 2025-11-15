import {
  Column,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column('text', { unique: true })
  @Field()
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  @Field(() => Float)
  cost: number;

  @Column('boolean', { default: true })
  @Field({ nullable: true })
  status?: boolean;

  @Column('int')
  @Field(() => Int)
  max_classes_assistance: number;

  @Column('int')
  @Field(() => Int)
  max_gym_assistance: number;

  @Column('int')
  @Field(() => Int)
  duration_months: number;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @ManyToMany('Subscription', { eager: false })
  @JoinTable({
    name: 'memberships_subscription',
    joinColumn: { name: 'membershipId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'subscriptionId', referencedColumnName: 'id' },
  })
  Subscription: any[];
}
