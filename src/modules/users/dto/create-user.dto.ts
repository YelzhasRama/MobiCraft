import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';
import { UserRole } from '../../../common/constants/user-role';
import { Gender } from '../../../common/constants/gender';

export class CreateUserDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  servicePrice?: string;

  @IsOptional()
  @IsString()
  device?: string;

  // Новые поля
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  accessories?: number[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  categories?: number[];
}
