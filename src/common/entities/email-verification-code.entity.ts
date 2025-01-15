import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('email_verification_codes')
export class EmailVerificationCodeEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id: number;

  @Column({
    name: 'user_id',
    type: 'bigint',
  })
  userId: number;

  @Column({
    name: 'code',
    type: 'text',
  })
  code: string;

  @Column({
    name: 'used_at',
    type: 'timestamptz',
  })
  usedAt: string;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
  })
  expiresAt: string;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: 'now()',
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: 'now()',
  })
  updatedAt: string;
}
