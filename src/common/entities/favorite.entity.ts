import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { OrderEntity } from './order.entity';

@Entity('favorites')
export class FavoriteEntity {
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
    name: 'order_id',
    type: 'bigint',
    nullable: true,
  })
  orderId: number | null;

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

  @ManyToOne(() => UserEntity, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @ManyToOne(() => OrderEntity, (order) => order.favorites)
  @JoinColumn({ name: 'order_id' })
  order?: OrderEntity;
}
