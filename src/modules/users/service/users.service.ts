import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../../../common/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersRepository.createUser(createUserDto);
  }

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
}
