import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  hash: string;
}
