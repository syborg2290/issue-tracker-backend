import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Issue } from '../domain/issue';
import { IssueStatus } from './issue-status.enum';
import { IssuePriority } from './issue-priority.enum';
import { IssueSeverity } from './issue-severity.enum';

export class QueryIssuesDto {
  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ type: () => [SortIssuesDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SortIssuesDto)
  sort?: SortIssuesDto[];

  @ApiProperty({ type: () => FilterIssuesDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FilterIssuesDto)
  filters?: FilterIssuesDto;
}

export class SortIssuesDto {
  @ApiProperty()
  @IsString()
  orderBy: keyof Issue;

  @ApiProperty()
  @IsString()
  order: 'ASC' | 'DESC';
}

export class FilterIssuesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  title?: string;

  @ApiProperty({ required: false, enum: IssueStatus })
  @IsOptional()
  @IsString()
  status?: keyof typeof IssueStatus;

  @ApiProperty({ required: false, enum: IssueSeverity })
  @IsOptional()
  @IsString()
  severity?: keyof typeof IssueSeverity;

  @ApiProperty({ required: false, enum: IssuePriority })
  @IsOptional()
  @IsString()
  priority?: keyof typeof IssuePriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  start?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  end?: string;
}