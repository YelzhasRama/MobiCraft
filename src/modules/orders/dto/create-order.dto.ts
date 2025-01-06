import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  shootingDate: string;

  @IsNumber()
  @IsOptional()
  totalBudget: number; // Убедитесь, что это поле соответствует `totalBudget` в сущности

  @IsString()
  @IsOptional()
  city: string; // Изменено на 'city', как в сущности

  @IsString()
  @IsOptional()
  chronometry: string; // Изменено на 'chronometry', как в сущности

  @IsString()
  @IsOptional()
  clientName: string; // This corresponds to the 'client_name' field in the entity

  @IsOptional()
  clientId: string; // Идентификатор клиента, связанный с `UserEntity`

  @IsOptional()
  categoryIds?: string[]; // Массив идентификаторов категорий для связи ManyToMany
}
