import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PermissionDto{
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}
