import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../../common/entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RegisterBody } from '../../auth/bodies/register.body';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  getOneByEmail(email: string) {
    const user = this.findOne({ where: { email }, relations: ['accessories'] });
    return user;
  }

  async createUser(payload: RegisterBody) {
    const user = this.create(payload);
    return this.save(user);
  }

  async findWithRelations(): Promise<UserEntity[]> {
    return this.find({ relations: ['categories', 'portfolios', 'orders'] });
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.findOne({
      where: { id },
      relations: [
        'categories',
        'portfolios',
        'orders',
        'profileImage.staticObject',
        'videos.staticObject',
      ],
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

  async verifyUserById(id: number): Promise<void> {
    await this.update({ id }, { emailVerifiedAt: 'now()' });
  }
}
