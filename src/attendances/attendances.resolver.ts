import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AttendancesService } from './attendances.service';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceInput } from './dto/create-attendance.dto';
import { UpdateAttendanceInput } from './dto/update-attendance.dto';

@Resolver('Attendance')
export class AttendancesResolver {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Query(() => [Attendance])
  async attendances(@Args('userId') userId: string) {
    return this.attendancesService.getUserAttendances(userId);
  }

  @Query(() => Attendance)
  async attendance(@Args('id') id: string) {
    return this.attendancesService.findAttendanceById(id);
  }

  @Mutation(() => Attendance)
  async createAttendance(
    @Args('createAttendanceInput') createAttendanceInput: CreateAttendanceInput,
  ) {
    return this.attendancesService.createAttendance(createAttendanceInput);
  }

  @Mutation(() => Attendance)
  async updateAttendance(
    @Args('updateAttendanceInput') updateAttendanceInput: UpdateAttendanceInput,
  ) {
    return this.attendancesService.updateAttendance(
      updateAttendanceInput.id,
      updateAttendanceInput,
    );
  }

  @Mutation(() => Boolean)
  async removeAttendance(@Args('id') id: string) {
    await this.attendancesService.removeAttendance(id);
    return true;
  }
}
