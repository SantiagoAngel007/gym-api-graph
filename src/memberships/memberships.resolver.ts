import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MembershipsService } from './memberships.service';
import { Membership } from './entities/membership.entity';
import { CreateMembershipInput, CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipInput, UpdateMembershipDto } from './dto/update-membership.dto';

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
    const dto = new CreateMembershipDto();
    Object.assign(dto, createMembershipInput);
    return this.membershipsService.createNewMembership(dto);
  }

  @Mutation(() => Membership)
  async updateMembership(
    @Args('updateMembershipInput') updateMembershipInput: UpdateMembershipInput,
  ) {
    const dto = new UpdateMembershipDto();
    Object.assign(dto, updateMembershipInput);
    return this.membershipsService.updateExistingMembership(
      updateMembershipInput.id,
      dto,
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
