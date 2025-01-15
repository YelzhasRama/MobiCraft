import { Injectable } from '@nestjs/common';
import { EmailVerificationCodeEntity } from 'src/common/entities/email-verification-code.entity';
import { DataSource, Repository } from 'typeorm';
import { UpsertEmailVerificationCodeDto } from '../dto/upsert-email-verification-code.dto';
import { EmailVerificationCode } from '../dto/email-verification-code';

@Injectable()
export class EmailVerificationCodesRepository extends Repository<EmailVerificationCodeEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(EmailVerificationCodeEntity, dataSource.createEntityManager());
  }

  async upsertAndFetchOne(
    payload: UpsertEmailVerificationCodeDto,
  ): Promise<EmailVerificationCode> {
    const existingEmailVerificationCode = await this.findOneBy({
      userId: payload.userId,
    });
    if (existingEmailVerificationCode) {
      await this.update(existingEmailVerificationCode.id, payload);

      return this.findOneBy({
        userId: payload.userId,
      });
    }

    const verificationCode = this.create(payload);
    await this.save(verificationCode);

    return verificationCode;
  }

  findByUserId(userId: number): Promise<EmailVerificationCode | null> {
    return this.findOneBy({ userId });
  }

  findByUserIdAndCode(
    userId: number,
    code: string,
  ): Promise<EmailVerificationCode | null> {
    return this.findOneBy({ userId, code });
  }

  async setAsUsedByUserId(userId: number): Promise<void> {
    await this.update({ userId }, { usedAt: 'now()' });
  }
}
