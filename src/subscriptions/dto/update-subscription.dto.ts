import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateSubscriptionInput, CreateSubscriptionDto } from './create-subscription.dto';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class UpdateSubscriptionInput extends PartialType(CreateSubscriptionInput) {
  @Field()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Keep the DTO for backwards compatibility if needed
export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
