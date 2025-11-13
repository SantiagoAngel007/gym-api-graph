import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MembershipsService } from './memberships.service';
import { Membership } from './entities/membership.entity';
import { CreateMembershipInput } from './dto/create-membership.dto';
import { UpdateMembershipInput } from './dto/update-membership.dto';

@Resolver('Membership')
export class MembershipsResolver {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Query(() => [Membership])
  async memberships() {
    return this.membershipsService.findAll();
  }

  @Query(() => Membership)
  async membership(@Args('id') id: string) {
    return this.membershipsService.findMembershipById(id);
  }

  @Mutation(() => Membership)
  async createMembership(
    @Args('createMembershipInput') createMembershipInput: CreateMembershipInput,
  ) {
    return this.membershipsService.createNewMembership(createMembershipInput);
  }

  @Mutation(() => Membership)
  async updateMembership(
    @Args('updateMembershipInput') updateMembershipInput: UpdateMembershipInput,
  ) {
    return this.membershipsService.updateExistingMembership(
      updateMembershipInput.id,
      updateMembershipInput,
    );
  }

  @Mutation(() => Membership)
  async toggleMembershipStatus(@Args('id') id: string) {
    return this.membershipsService.toggleMembershipStatus(id);
  }

  @Mutation(() => Boolean)
  async removeMembership(@Args('id') id: string) {
    await this.membershipsService.removeMembership(id);
    return true;
  }
}
