import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IssuePriority } from './issue-priority.enum';

export class UpdateIssuePriorityDto {
    @ApiProperty({
        enum: IssuePriority,
        enumName: 'IssuePriority',
        example: IssuePriority.HIGH,
    })
    @IsEnum(IssuePriority)
    @IsNotEmpty()
    priority: IssuePriority;
}
