import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MembershipsService } from './memberships.service';
import { Membership } from './entities/membership.entity';
import {
  CreateMembershipInput,
  CreateMembershipDto,
} from './dto/create-membership.dto';
import {
  UpdateMembershipInput,
  UpdateMembershipDto,
} from './dto/update-membership.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/enums/roles.enum';

@Resolver('Membership')
export class MembershipsResolver {
  constructor(private readonly membershipsService: MembershipsService) {}

  // Queries - Todos los usuarios autenticados pueden ver las membresías
  @Query(() => [Membership], {
    name: 'memberships',
    description: 'Get all available memberships - Requires authentication',
  })
  @Auth()
  async memberships() {
    return this.membershipsService.findAll();
  }

  @Query(() => Membership, {
    name: 'membership',
    description: 'Get membership by ID - Requires authentication',
  })
  @Auth()
  async membership(@Args('id') id: string) {
    return this.membershipsService.findMembershipById(id);
  }

  // Mutations - Solo admins pueden gestionar membresías
  @Mutation(() => Membership, {
    name: 'createMembership',
    description: 'Create new membership template - Admin only',
  })
  @Auth(ValidRoles.admin)
  async createMembership(
    @Args('createMembershipInput') createMembershipInput: CreateMembershipInput,
  ) {
    const dto = new CreateMembershipDto();
    Object.assign(dto, createMembershipInput);
    return this.membershipsService.createNewMembership(dto);
  }

  @Mutation(() => Membership, {
    name: 'updateMembership',
    description: 'Update membership template - Admin only',
  })
  @Auth(ValidRoles.admin)
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

  @Mutation(() => Membership, {
    name: 'toggleMembershipStatus',
    description: 'Activate or deactivate membership - Admin only',
  })
  @Auth(ValidRoles.admin)
  async toggleMembershipStatus(@Args('id') id: string) {
    return this.membershipsService.toggleMembershipStatus(id);
  }

  @Mutation(() => Boolean, {
    name: 'removeMembership',
    description: 'Delete membership template - Admin only',
  })
  @Auth(ValidRoles.admin)
  async removeMembership(@Args('id') id: string) {
    await this.membershipsService.removeMembership(id);
    return true;
  }
}
