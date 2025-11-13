import { InputType, Field } from '@nestjs/graphql';
import {
  IsUUID,
  IsDateString,
  IsOptional,
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';
import { AttendanceType } from '../entities/attendance.entity';

@InputType()
export class CreateAttendanceInput {
  @Field()
  @IsUUID()
  readonly userId: string;

  @Field()
  @IsDateString()
  readonly entranceDatetime: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  readonly exitDatetime?: string;

  @Field(() => AttendanceType)
  @IsEnum(AttendanceType)
  readonly type: AttendanceType;

  @Field()
  @IsString()
  @MaxLength(50)
  readonly dateKey: string;
}

// Keep the DTO for backwards compatibility if needed
export class CreateAttendanceDto extends CreateAttendanceInput {}
