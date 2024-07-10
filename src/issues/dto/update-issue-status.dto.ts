import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IssueStatus } from './issue-status.enum';

export class UpdateIssueStatusDto {
  @ApiProperty({
    enum: IssueStatus,
    enumName: 'IssueStatus',
    example: IssueStatus.IN_PROGRESS,
  })
  @IsEnum(IssueStatus)
  @IsNotEmpty()
  status: IssueStatus;
}
