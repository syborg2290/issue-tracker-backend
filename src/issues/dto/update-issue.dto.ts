import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { IssueStatus } from './issue-status.enum';
import { IssueSeverity } from './issue-severity.enum';
import { IssuePriority } from './issue-priority.enum';

export class UpdateIssueDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  title?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({ enum: IssueStatus, enumName: 'IssueStatus' })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: IssueStatus;

  @ApiProperty({ enum: IssueSeverity, enumName: 'IssueSeverity', default: IssueSeverity.LOW })
  @IsOptional()
  @IsEnum(IssueSeverity)
  severity?: IssueSeverity;

  @ApiProperty({ enum: IssuePriority, enumName: 'IssuePriority', default: IssuePriority.LOW })
  @IsOptional()
  @IsEnum(IssuePriority)
  priority?: IssuePriority;

  @ApiProperty({ type: String })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  assignedTo?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  createdBy?: string;
}
