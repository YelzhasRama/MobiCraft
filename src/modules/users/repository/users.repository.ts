import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../../common/entities/user.entity';
import { RegisterBody } from '../../auth/bodies/register.body';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CategoriesRepository } from '../../categories/repository/categories.repository';
import { AccessoryRepository } from './accessory.repository';
import { UpdateLoginAndPasswordDto } from '../dto/update-login-and-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly caregoriesRepository: CategoriesRepository,
    private readonly accessoriesRepository: AccessoryRepository,
  ) {
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
      relations: ['profileImage.staticObject'],
    });
  }

  async updateLoginAndPassword(
    id: number,
    updateLoginAndPasswordDto: UpdateLoginAndPasswordDto,
  ): Promise<void> {
    const { email, password } = updateLoginAndPasswordDto;

    const updateData: Partial<UserEntity> = {};

    if (email) {
      updateData.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await this.createQueryBuilder()
      .update(UserEntity)
      .set(updateData)
      .where('id = :id', { id })
      .execute();
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne({
      where: { id },
      relations: ['accessories', 'categories'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Обновление простых полей
    Object.assign(user, updateUserDto);

    // Обновление связей
    if (updateUserDto.accessories) {
      const accessories = await this.accessoriesRepository.findByIds(
        updateUserDto.accessories,
      );
      user.accessories = accessories;
    }

    if (updateUserDto.categories) {
      const categories = await this.caregoriesRepository.findByIds(
        updateUserDto.categories,
      );
      user.categories = categories;
    }

    return await this.save(user);
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
