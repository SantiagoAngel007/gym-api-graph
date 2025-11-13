import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsInt,
  IsDate,
  Min,
  IsArray,
  IsUUID,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { CreateSubscriptionDto } from './create-subscription.dto';

@InputType()
export class UpdateSubscriptionInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  cost?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(0)
  max_classes_assistance?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(0)
  max_gym_assistance?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  @Min(1)
  duration_months?: number;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  purchase_date?: Date;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  membershipIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Keep the DTO for backwards compatibility if needed
export class UpdateSubscriptionDto extends CreateSubscriptionDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
