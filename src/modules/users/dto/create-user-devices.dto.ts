import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateUserDevicesDto {
  @IsString()
  @IsOptional()
  device: string; // название устройства

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  accessories: number[]; // массив идентификаторов аксессуаров
}
