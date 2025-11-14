import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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

@Resolver('Subscription')
export class SubscriptionsResolver {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // Queries protegidas - Solo admin puede ver todas las suscripciones
  @Query(() => [Subscription], {
    name: 'subscriptions',
    description: 'Get all subscriptions - Admin only',
  })
  @Auth(ValidRoles.admin)
  async subscriptions() {
    return this.subscriptionsService.findAll();
  }

  // Queries protegidas - Usuarios autenticados pueden ver suscripciones
  @Query(() => Subscription, {
    name: 'subscriptionByUserId',
    description: 'Get subscription by user ID - Requires authentication',
  })
  @Auth()
  async subscriptionByUserId(
    @Args('userId') userId: string,
    @GetUser() authUser: User,
  ) {
    // Solo admins pueden ver suscripciones de otros usuarios
    const isAdmin = authUser.roles.some(
      (role) => role.name === String(ValidRoles.admin),
    );
    if (!isAdmin && authUser.id !== userId) {
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
      'Create subscription for user - Users can create for themselves, admins can create for anyone',
  })
  @Auth()
  async createSubscriptionForUser(
    @Args('userId') userId: string,
    @GetUser() authUser: User,
  ) {
    // Solo admins pueden crear suscripciones para otros usuarios
    const isAdmin = authUser.roles.some(
      (role) => role.name === String(ValidRoles.admin),
    );
    if (!isAdmin && authUser.id !== userId) {
      throw new Error('You can only create subscriptions for yourself');
    }
    return this.subscriptionsService.createSubscriptionForUser(userId);
  }

  @Mutation(() => Subscription, {
    name: 'updateSubscription',
    description:
      'Update subscription - Users can only update their own, admins can update all',
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
      'Deactivate subscription - Users can only deactivate their own, admins can deactivate all',
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
      'Activate subscription - Users can only activate their own, admins can activate all',
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
}
