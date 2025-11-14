import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

@InputType()
export class UpdateAttendanceInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  exitDatetime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Keep the DTO for backwards compatibility if needed
export class UpdateAttendanceDto {
  @IsOptional()
  @IsDateString()
  readonly exitDatetime?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
