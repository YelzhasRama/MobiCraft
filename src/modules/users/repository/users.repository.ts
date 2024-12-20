import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../../common/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = this.create(createUserDto);
    return this.save(user);
  }

  async findWithRelations(): Promise<UserEntity[]> {
    return this.find({ relations: ['categories', 'portfolios', 'orders'] });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['categories', 'portfolios', 'orders'],
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    return this.save(user);
  }

  async removeUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    if (user) {
      await this.softRemove(user);
    }
  }
}