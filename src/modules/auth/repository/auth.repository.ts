import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRefreshTokenEntity } from '../../../common/entities/user-refresh-token.entity';
import { UserRefreshToken } from '../../../common/models/user-refresh-token';

@Injectable()
export class AuthRepository extends Repository<UserRefreshTokenEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserRefreshTokenEntity, dataSource.createEntityManager());
  }

  async deleteOneByUserId(userId: number): Promise<void> {
    await this.delete({ userId });
  }

  async getOneByUserIdAndToken(
    userId: number,
    token: string,
  ): Promise<UserRefreshToken> {
    return this.findOneBy({ userId, token });
  }
}
