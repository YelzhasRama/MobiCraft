import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Gender } from '../../../common/constants/gender';
import { UserRole } from '../../../common/constants/user-role';

export class UpdateProfileBody {
  @ApiProperty({
    description: 'User role',
    example: UserRole.CLIENT,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  @IsOptional()
  role: UserRole | null;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
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
