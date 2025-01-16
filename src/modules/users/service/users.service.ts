import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../../../common/entities/user.entity';
import { CreateUserDevicesDto } from '../dto/create-user-devices.dto';
import { AccessoryRepository } from '../repository/accessory.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly accessoryRepository: AccessoryRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.findWithRelations();
  }

  async findOne(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findUserById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.usersRepository.updateUser(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    return this.usersRepository.removeUser(id);
  }

  async saveMobilographDevices(
    userId: number,
    createMobilographDeviceDto: CreateUserDevicesDto,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (createMobilographDeviceDto.device) {
      user.device = createMobilographDeviceDto.device;
    }

    if (createMobilographDeviceDto.accessories) {
      const accessories = await this.accessoryRepository.saveAccessories(
        createMobilographDeviceDto.accessories,
      );
      user.accessories = accessories;
    }

    // Сохраняем изменения в базе
    return this.usersRepository.save(user);
  }
}
