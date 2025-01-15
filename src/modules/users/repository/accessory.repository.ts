// accessory.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository, DataSource, In } from 'typeorm';
import { AccessoryEntity } from '../../../common/entities/accessory.entity';

@Injectable()
export class AccessoryRepository extends Repository<AccessoryEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AccessoryEntity, dataSource.createEntityManager());
  }

  async getAllAccessories() {
    return this.find();
  }

  // Метод для нахождения аксессуаров по их ID
  async findByIds(ids: number[]): Promise<AccessoryEntity[]> {
    return this.find({ where: { id: In(ids) } });
  }

  // Метод для сохранения массива аксессуаров
  async saveAccessories(accessories: number[]): Promise<AccessoryEntity[]> {
    // Извлекаем уже существующие аксессуары
    const existingAccessories = await this.findByIds(accessories);

    // Создаем новые аксессуары, которых нет в базе данных
    const newAccessories = accessories.filter(
      (id) => !existingAccessories.some((acc) => acc.id === id),
    );

    // Если есть новые аксессуары, их нужно сохранить
    if (newAccessories.length > 0) {
      const newAccessoryEntities = newAccessories.map((id) => {
        const accessory = new AccessoryEntity();
        accessory.id = id; // Присваиваем id новым аксессуарам (если они должны быть созданы)
        return accessory;
      });

      // Сохраняем новые аксессуары в базе данных
      await this.save(newAccessoryEntities);
      return [...existingAccessories, ...newAccessoryEntities];
    }

    return existingAccessories;
  }
}
