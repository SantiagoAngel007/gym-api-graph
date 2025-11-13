import { Resolver, Query, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AttendancesService } from './attendances.service';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceInput } from './dto/create-attendance.dto';
import { UpdateAttendanceInput } from './dto/update-attendance.dto';

@ObjectType()
export class AttendanceStatusResponse {
  @Field()
  isInside: boolean;

  @Field(() => Attendance, { nullable: true })
  currentAttendance?: Attendance;

  @Field()
  availableAttendances: string;
}

@Resolver('Attendance')
export class AttendancesResolver {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Query(() => AttendanceStatusResponse)
  async attendanceStatus(@Args('userId') userId: string) {
    return this.attendancesService.getUserAttendanceStatus(userId);
  }

  @Mutation(() => Attendance)
  async checkIn(
    @Args('createAttendanceInput') createAttendanceInput: CreateAttendanceInput,
  ) {
    return this.attendancesService.checkIn(createAttendanceInput);
  }

  @Mutation(() => Attendance)
  async checkOut(@Args('userId') userId: string) {
    return this.attendancesService.checkOut(userId);
  }
}
