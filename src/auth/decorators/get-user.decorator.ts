import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    // Convertir el contexto a GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const user = req.user;
    if (!user) throw new InternalServerErrorException(`User not found`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  },
);
