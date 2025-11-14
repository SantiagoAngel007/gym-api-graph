import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';

@InputType()
export class CreateMembershipInput {
  @Field()
  @IsString()
  @IsNotEmpty()
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
  @IsIn([1, 12], {
    message: 'La duración debe ser 1 mes (mensual) o 12 meses (anual)',
  })
  duration_months: number;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

// Keep the DTO for backwards compatibility if needed
export class CreateMembershipDto extends CreateMembershipInput {}
