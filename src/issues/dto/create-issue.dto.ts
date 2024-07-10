import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IssueStatus } from './issue-status.enum';
import { IssueSeverity } from './issue-severity.enum';
import { IssuePriority } from './issue-priority.enum';

export class CreateIssueDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  description: string;

  @ApiProperty({ enum: IssueStatus, enumName: 'IssueStatus' })
  @IsNotEmpty()
  @IsEnum(IssueStatus)
  status: IssueStatus;

  @ApiProperty({ enum: IssueSeverity, enumName: 'IssueSeverity', default: IssueSeverity.LOW })
  @IsNotEmpty()
  @IsEnum(IssueSeverity)
  severity: IssueSeverity;

  @ApiProperty({ enum: IssuePriority, enumName: 'IssuePriority', default: IssuePriority.LOW })
  @IsNotEmpty()
  @IsEnum(IssuePriority)
  priority: IssuePriority;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  assignedTo: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  createdBy: string;
}
