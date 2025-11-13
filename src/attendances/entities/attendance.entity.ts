import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum AttendanceType {
  GYM = 'gym',
  CLASS = 'class',
}

registerEnumType(AttendanceType, {
  name: 'AttendanceType',
});

@Entity()
@ObjectType()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @ManyToOne('User', 'attendances', { onDelete: 'CASCADE' })
  user: any;

  @Column({
    type: 'enum',
    enum: AttendanceType,
  })
  @Field(() => AttendanceType)
  type: AttendanceType;

  @Column('timestamp')
  @Field()
  entranceDatetime: Date;

  @Column('timestamp', { nullable: true })
  @Field({ nullable: true })
  exitDatetime?: Date;

  @Column('boolean', { default: true })
  @Field()
  isActive: boolean;

  @Column('varchar', { length: 10 })
  @Field()
  dateKey: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;
}
