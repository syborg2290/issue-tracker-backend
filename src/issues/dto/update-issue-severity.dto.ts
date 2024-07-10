import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IssueSeverity } from './issue-severity.enum';

export class UpdateIssueSeverityDto {
  @ApiProperty({
    enum: IssueSeverity,
    enumName: 'IssueSeverity',
    example: IssueSeverity.HIGH,
  })
  @IsEnum(IssueSeverity)
  @IsNotEmpty()
  severity: IssueSeverity;
}
