import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql';
import { AttendancesService } from './attendances.service';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceInput } from './dto/create-attendance.dto';
import { UpdateAttendanceInput } from './dto/update-attendance.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/users.entity';
import { ValidRoles } from 'src/auth/enums/roles.enum';
import { ForbiddenException } from '@nestjs/common';

@ObjectType()
export class AvailableAttendancesResponse {
  @Field(() => Int)
  gym: number;

  @Field(() => Int)
  classes: number;
}

@ObjectType()
export class AttendanceStatusResponse {
  @Field()
  isInside: boolean;

  @Field(() => Attendance, { nullable: true })
  currentAttendance?: Attendance;

  @Field(() => AvailableAttendancesResponse)
  availableAttendances: AvailableAttendancesResponse;
}

@Resolver('Attendance')
export class AttendancesResolver {
  constructor(private readonly attendancesService: AttendancesService) {}

  // Query protegida - Usuarios pueden ver solo su propio estado, admins/receptionistas pueden ver todos
  @Query(() => AttendanceStatusResponse, {
    name: 'attendanceStatus',
    description:
      'Get attendance status for a user - Users can only see their own, admins and receptionists can see all',
  })
  @Auth()
  async attendanceStatus(
    @Args('userId') userId: string,
    @GetUser() authUser: User,
  ) {
    // Verificar si es admin o receptionist
    const hasPermission = authUser.roles.some(
      (role) =>
        role.name === String(ValidRoles.admin) ||
        role.name === String(ValidRoles.receptionist),
    );

    // Si no es admin/receptionist, solo puede ver su propio estado
    if (!hasPermission && authUser.id !== userId) {
      throw new ForbiddenException(
        'You can only check your own attendance status',
      );
    }

    return this.attendancesService.getUserAttendanceStatus(userId);
  }

  // Mutations protegidas - Usuarios pueden hacer check-in para sí mismos, admins/receptionistas para cualquiera
  @Mutation(() => Attendance, {
    name: 'checkIn',
    description:
      'Check in to gym or class - Users can check in themselves, admins and receptionists can check in anyone',
  })
  @Auth()
  async checkIn(
    @Args('createAttendanceInput') createAttendanceInput: CreateAttendanceInput,
    @GetUser() authUser: User,
  ) {
    // Verificar si es admin o receptionist
    const hasPermission = authUser.roles.some(
      (role) =>
        role.name === String(ValidRoles.admin) ||
        role.name === String(ValidRoles.receptionist),
    );

    // Si no es admin/receptionist, solo puede hacer check-in para sí mismo
    if (!hasPermission && authUser.id !== createAttendanceInput.userId) {
      throw new ForbiddenException('You can only check in yourself');
    }

    return this.attendancesService.checkIn(createAttendanceInput);
  }

  @Mutation(() => Attendance, {
    name: 'checkOut',
    description:
      'Check out from gym or class - Users can check out themselves, admins and receptionists can check out anyone',
  })
  @Auth()
  async checkOut(@Args('userId') userId: string, @GetUser() authUser: User) {
    // Verificar si es admin o receptionist
    const hasPermission = authUser.roles.some(
      (role) =>
        role.name === String(ValidRoles.admin) ||
        role.name === String(ValidRoles.receptionist),
    );

    // Si no es admin/receptionist, solo puede hacer check-out para sí mismo
    if (!hasPermission && authUser.id !== userId) {
      throw new ForbiddenException('You can only check out yourself');
    }

    return this.attendancesService.checkOut(userId);
  }
}
