import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { META_DATA } from '../decorators/role-protected/role-protected.decorator';
import { User } from '../entities/users.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_DATA,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true;

    // Convertir el contexto a GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const user = req.user as User;

    if (!user || !user.roles)
      throw new BadRequestException(`User or roles not found`);

    const hasValidRole = user.roles.some((role) =>
      validRoles.includes(role.name),
    );

    if (hasValidRole) return true;

    throw new ForbiddenException(`User ${user.email} needs a valid role`);
  }
}
