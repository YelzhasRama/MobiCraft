import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
  NotContains,
  IsNumber,
} from 'class-validator';
import { UserRole } from '../../../common/constants/user-role';
import { Gender } from '../../../common/constants/gender';

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
    example: UserRole.CLIENT,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ description: 'User name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'User gender',
    example: Gender.MALE,
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @ApiProperty({ description: 'User age', example: 25 })
  @IsNumber()
  @Min(18, { message: 'Age must be at least 18.' })
  @IsOptional()
  age: number;

  @ApiProperty({
    description: 'User bio',
    example: 'Professional photographer.',
  })
  @IsString()
  @IsOptional()
  bio: string;

  @ApiProperty({ description: 'User location', example: 'New York, USA' })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({
    description: 'User current location',
    example: 'Brooklyn, NY',
  })
  @IsString()
  @IsOptional()
  whereAmI: string;

  @ApiProperty({ description: 'Service price', example: '150' })
  @IsString()
  @IsOptional()
  servicePrice: string;

  @ApiProperty({ description: 'Price unit', example: 'USD/hour' })
  @IsString()
  @IsOptional()
  priceUnit: string;

  @ApiProperty({ description: 'Phone number', example: '+1234567890' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international E.164 format.',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'User categories',
    type: [String],
    example: ['Photography', 'Editing'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories: string[];
}
