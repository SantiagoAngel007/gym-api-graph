import { InputType, Field, Int, Float, PartialType } from '@nestjs/graphql';
import { CreateMembershipInput, CreateMembershipDto } from './create-membership.dto';

@InputType()
export class UpdateMembershipInput extends PartialType(CreateMembershipInput) {
  @Field()
  id: string;
}

// Keep the DTO for backwards compatibility if needed
export class UpdateMembershipDto extends PartialType(CreateMembershipDto) {}
