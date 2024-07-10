import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { RoleDto } from '../../roles/dto/role.dto';
import { Permission } from '../../permission/domain/permission';
import { FileDto } from 'src/files/dto/file.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  email: string | null;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  @Transform(({ value }) => value?.trim())
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  address?: string | null;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto;

  @ApiProperty()
  permissons?: Permission[] | null;

  hash?: string | null;
}
