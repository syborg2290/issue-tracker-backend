import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { FileDto } from 'src/files/dto/file.dto';


export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  email: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  password: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiProperty({ example: 'galle' })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  address: string | null;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  roleId: number;

  // @ApiProperty({ type: StatusDto })
  // @IsOptional()
  // @Type(() => StatusDto)
  // status?: StatusDto;
}
