import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.dto';
import { UpdateSubscriptionInput } from './dto/update-subscription.dto';

@Resolver('Subscription')
export class SubscriptionsResolver {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Query(() => Subscription)
  async subscriptionByUserId(@Args('userId') userId: string) {
    return this.subscriptionsService.findSubscriptionByUserId(userId);
  }

  @Mutation(() => Subscription)
  async createSubscription(
    @Args('userId') userId: string,
    @Args('createSubscriptionInput') createSubscriptionInput: CreateSubscriptionInput,
  ) {
    return this.subscriptionsService.createUserSubscription(
      userId,
      createSubscriptionInput,
    );
  }

  @Mutation(() => Subscription)
  async updateSubscription(
    @Args('updateSubscriptionInput') updateSubscriptionInput: UpdateSubscriptionInput,
  ) {
    return this.subscriptionsService.updateSubscription(
      updateSubscriptionInput.id,
      updateSubscriptionInput,
    );
  }

  @Mutation(() => Boolean)
  async removeSubscription(@Args('id') id: string) {
    await this.subscriptionsService.removeSubscription(id);
    return true;
  }
}
