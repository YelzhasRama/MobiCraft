import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  shootingDate?: string;

  @IsOptional()
  @IsNumber()
  totalBudget?: number; // Обновлённое поле totalBudget

  @IsOptional()
  @IsString()
  city?: string; // Обновлённое поле city

  @IsOptional()
  @IsNumber()
  viewsCount?: number;

  @IsOptional()
  @IsString()
  chronometry?: string; // Обновлённое поле chronometry

  @IsOptional()
  @IsString()
  clientName?: string; // Обновлённое поле clientName

  @IsOptional()
  clientId?: string; // Обновлённое поле clientId

  @IsOptional()
  categoryIds?: string[]; // Массив для категорий
}
