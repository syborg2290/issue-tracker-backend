import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'src/roles/domain/role';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class InputRolePermissionDto {
  @ApiProperty({ type: Role })
  @IsOptional()
  @Type(() => Role)
  role: Role;

  @ApiProperty({type: []})
  @IsNotEmpty()
  permission: [];

  @ApiProperty()
  @IsOptional()
  status: StatusEnum;
}
