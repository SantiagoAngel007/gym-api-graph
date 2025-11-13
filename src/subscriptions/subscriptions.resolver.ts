import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionInput, CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionInput, UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Resolver('Subscription')
export class SubscriptionsResolver {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Query(() => Subscription)
  async subscriptionByUserId(@Args('userId') userId: string) {
    return this.subscriptionsService.findSubscriptionByUserId(userId);
  }

  @Query(() => Subscription)
  async subscription(@Args('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Query(() => [Subscription])
  async subscriptions() {
    return this.subscriptionsService.findAll();
  }

  @Mutation(() => Subscription)
  async createSubscriptionForUser(@Args('userId') userId: string) {
    return this.subscriptionsService.createSubscriptionForUser(userId);
  }

  @Mutation(() => Subscription)
  async updateSubscription(
    @Args('updateSubscriptionInput') updateSubscriptionInput: UpdateSubscriptionInput,
  ) {
    const dto = new UpdateSubscriptionDto();
    Object.assign(dto, updateSubscriptionInput);
    return this.subscriptionsService.update(
      updateSubscriptionInput.id,
      dto,
    );
  }

  @Mutation(() => Subscription)
  async deactivateSubscription(@Args('id') id: string) {
    return this.subscriptionsService.deactivateSubscription(id);
  }

  @Mutation(() => Subscription)
  async activateSubscription(@Args('id') id: string) {
    return this.subscriptionsService.activateSubscription(id);
  }

  @Mutation(() => Boolean)
  async removeSubscription(@Args('id') id: string) {
    await this.subscriptionsService.remove(id);
    return true;
  }
}
