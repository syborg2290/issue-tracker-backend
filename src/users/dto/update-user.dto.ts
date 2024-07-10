import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { RoleDto } from '../../roles/dto/role.dto';
import { Permission } from '../../permission/domain/permission';
import { FileDto } from 'src/files/dto/file.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  email?: string | null;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  @Transform(({ value }) => value?.trim())
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @ApiProperty({ type: FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto;

  @ApiProperty()
  @IsOptional()
  status: number;

  @ApiProperty()
  @IsOptional()
  permissons?: Permission[] | null;

  hash?: string | null;
}
