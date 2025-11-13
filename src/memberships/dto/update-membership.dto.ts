import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsBoolean, IsOptional, IsInt, Min, IsIn } from 'class-validator';
import { CreateMembershipDto } from './create-membership.dto';

@InputType()
export class UpdateMembershipInput {
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
  @IsIn([1, 12], {
    message: 'La duración debe ser 1 mes (mensual) o 12 meses (anual)',
  })
  duration_months?: number;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}

// Keep the DTO for backwards compatibility if needed
export class UpdateMembershipDto extends CreateMembershipDto {}
