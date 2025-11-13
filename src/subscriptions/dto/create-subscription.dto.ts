import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsInt,
  IsDate,
  Min,
  IsArray,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateSubscriptionInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  cost: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  max_classes_assistance: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  max_gym_assistance: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  duration_months: number;

  @Field()
  @IsDate()
  purchase_date: Date;

  @Field(() => [String])
  @IsArray()
  @IsUUID('4', { each: true })
  membershipIds: string[];
}

// Keep the DTO for backwards compatibility if needed
export class CreateSubscriptionDto extends CreateSubscriptionInput {}
