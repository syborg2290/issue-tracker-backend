import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { Transform } from 'class-transformer';

export class AuthUpdateDto {
  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsNotEmpty({ message: 'Must be not empty' })
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsNotEmpty({ message: 'Must be not empty' })
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  @Transform(({ value }) => value?.trim())
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ message: 'Must be not empty' })
  @Transform(({ value }) => value?.trim())
  oldPassword?: string;
}
