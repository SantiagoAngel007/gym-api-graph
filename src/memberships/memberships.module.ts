import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { MembershipsResolver } from './memberships.resolver';
import { Membership } from './entities/membership.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership]),
    forwardRef(() => AuthModule),
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService, MembershipsResolver],
  exports: [MembershipsService, TypeOrmModule],
})
export class MembershipsModule {}
