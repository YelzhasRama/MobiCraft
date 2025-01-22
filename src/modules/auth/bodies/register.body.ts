import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';
import { UserRole } from '../../../common/constants/user-role';

export class RegisterBody {
  @ApiProperty({ description: 'User email', example: 'example@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    description: 'User password without spaces',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @NotContains(' ', { message: 'No spaces allowed' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\W_]).{8,}$/, {
    message:
      'Field must contain at least one uppercase letter, one number, one special character, and must be at least 8 characters long.',
  })
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole | null;

  @ApiProperty({ description: 'User name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
