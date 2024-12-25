import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDate()
  shootingDate: string;

  @IsNumber()
  totalBudget: number; // Убедитесь, что это поле соответствует `totalBudget` в сущности

  @IsString()
  city: string; // Изменено на 'city', как в сущности

  @IsString()
  chronometry: string; // Изменено на 'chronometry', как в сущности

  @IsString()
  clientName: string; // Соответствует полю 'client_name' в сущности

  clientId: string; // Идентификатор клиента, связанный с `UserEntity`

  @IsOptional()
  categoryIds?: string[]; // Массив идентификаторов категорий для связи ManyToMany
}
