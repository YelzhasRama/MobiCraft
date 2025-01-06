import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { StaticObjectEntity } from './static-object.entity';

@Entity('user_profile_image')
export class UserProfileImageEntity {
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
    name: 'static_object_id',
    type: 'bigint',
  })
  staticObjectId: number;

  @CreateDateColumn({
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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: string | null;

  @OneToOne(() => UserEntity, (user) => user.profileImage)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToOne(() => StaticObjectEntity)
  @JoinColumn({ name: 'static_object_id' })
  staticObject?: StaticObjectEntity;
}
