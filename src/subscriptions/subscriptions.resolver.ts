import { Resolver, Query, Mutation, Args, InputType, Field } from '@nestjs/graphql';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import {
  CreateSubscriptionInput,
  CreateSubscriptionDto,
} from './dto/create-subscription.dto';
import {
  UpdateSubscriptionInput,
  UpdateSubscriptionDto,
} from './dto/update-subscription.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/users.entity';
import { ValidRoles } from 'src/auth/enums/roles.enum';
import { AddMembershipDto } from './dto/add-membership.dto';

@InputType()
export class AddMembershipInput {
  @Field()
  subscriptionId: string;

  @Field()
  membershipId: string;
}

@Resolver('Subscription')
export class SubscriptionsResolver {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // Queries protegidas - Solo admin y receptionist pueden ver todas las suscripciones
  @Query(() => [Subscription], {
    name: 'subscriptions',
    description: 'Get all subscriptions - Admin and receptionist only',
  })
  @Auth()
  async subscriptions(@GetUser() authUser: User) {
    return this.subscriptionsService.findAll(authUser);
  }

  // Queries protegidas - Usuarios autenticados pueden ver suscripciones
  @Query(() => Subscription, {
    name: 'subscriptionByUserId',
    description: 'Get subscription by user ID - Users can access their own, admin and receptionist can access all',
  })
  @Auth()
  async subscriptionByUserId(
    @Args('userId') userId: string,
    @GetUser() authUser: User,
  ) {
    // Admin y receptionist pueden ver suscripciones de cualquier usuario
    const isAllowed = authUser.roles.some(
      (role) =>
        role.name === String(ValidRoles.admin) ||
        role.name === String(ValidRoles.receptionist),
    );
    if (!isAllowed && authUser.id !== userId) {
      throw new Error('You can only access your own subscription');
    }
    return this.subscriptionsService.findSubscriptionByUserId(userId);
  }

  @Query(() => Subscription, {
    name: 'subscription',
    description:
      'Get subscription by ID - Users can only access their own, admins can access all',
  })
  @Auth()
  async subscription(@Args('id') id: string, @GetUser() authUser: User) {
    return this.subscriptionsService.findOne(id, authUser);
  }

  // Mutations protegidas - Usuarios autenticados pueden crear suscripciones
  @Mutation(() => Subscription, {
    name: 'createSubscriptionForUser',
    description:
      'Create subscription for user - Users can create for themselves, admin and receptionist can create for anyone',
  })
  @Auth()
  async createSubscriptionForUser(
    @Args('userId') userId: string,
    @GetUser() authUser: User,
  ) {
    // Admin y receptionist pueden crear suscripciones para otros usuarios
    const isAllowed = authUser.roles.some(
      (role) =>
        role.name === String(ValidRoles.admin) ||
        role.name === String(ValidRoles.receptionist),
    );
    if (!isAllowed && authUser.id !== userId) {
      throw new Error('You can only create subscriptions for yourself');
    }
    return this.subscriptionsService.createSubscriptionForUser(userId);
  }

  @Mutation(() => Subscription, {
    name: 'updateSubscription',
    description:
      'Update subscription - Users can only update their own, admin and receptionist can update all',
  })
  @Auth()
  async updateSubscription(
    @Args('updateSubscriptionInput') updateSubscriptionInput: UpdateSubscriptionInput,
    @GetUser() authUser: User,
  ) {
    const dto = new UpdateSubscriptionDto();
    Object.assign(dto, updateSubscriptionInput);
    return this.subscriptionsService.update(
      updateSubscriptionInput.id,
      dto,
      authUser,
    );
  }

  @Mutation(() => Subscription, {
    name: 'deactivateSubscription',
    description:
      'Deactivate subscription - Users can only deactivate their own, admin and receptionist can deactivate all',
  })
  @Auth()
  async deactivateSubscription(
    @Args('id') id: string,
    @GetUser() authUser: User,
  ) {
    return this.subscriptionsService.deactivateSubscription(id, authUser);
  }

  @Mutation(() => Subscription, {
    name: 'activateSubscription',
    description:
      'Activate subscription - Users can only activate their own, admin and receptionist can activate all',
  })
  @Auth()
  async activateSubscription(
    @Args('id') id: string,
    @GetUser() authUser: User,
  ) {
    return this.subscriptionsService.activateSubscription(id, authUser);
  }

  @Mutation(() => Boolean, {
    name: 'removeSubscription',
    description:
      'Delete subscription - Users can only delete their own, admins can delete all',
  })
  @Auth()
  async removeSubscription(@Args('id') id: string, @GetUser() authUser: User) {
    await this.subscriptionsService.remove(id, authUser);
    return true;
  }

  @Mutation(() => Subscription, {
    name: 'addMembershipToSubscription',
    description:
      'Add a membership to a subscription - Users can only add to their own, admin and receptionist can add to any',
  })
  @Auth()
  async addMembershipToSubscription(
    @Args('addMembershipInput') addMembershipInput: AddMembershipInput,
    @GetUser() authUser: User,
  ) {
    const subscription = await this.subscriptionsService.findOne(
      addMembershipInput.subscriptionId,
      authUser,
    );

    const addDto = new AddMembershipDto();
    addDto.membershipId = addMembershipInput.membershipId;

    return this.subscriptionsService.addMembershipToSubscription(
      addMembershipInput.subscriptionId,
      addDto,
    );
  }
}
