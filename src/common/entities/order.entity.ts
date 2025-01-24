import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { ResponseEntity } from './response.entity';
import { FavoriteEntity } from './favorite.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id: number;

  @Column({
    name: 'title',
    type: 'text',
    nullable: true,
  })
  title: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'shooting_date',
    type: 'text',
    nullable: true,
  })
  shootingDate: string;

  @Column({
    name: 'city',
    type: 'text',
    nullable: true,
  })
  city: string;

  @Column({
    name: 'chronometry',
    type: 'text',
    nullable: true,
  })
  chronometry: string;

  @Column({
    name: 'client_name',
    type: 'text',
    nullable: true,
  })
  clientName: string;

  @Column({
    name: 'views_count',
    type: 'integer',
    default: 0,
    nullable: true,
  })
  viewsCount: number;

  @Column({
    name: 'total_budget',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalBudget: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: string | null;

  @ManyToOne(() => UserEntity, (user) => user.orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: UserEntity;

  @ManyToMany(() => CategoryEntity, (category) => category.orders)
  @JoinTable({
    name: 'order_categories',
    joinColumns: [{ name: 'order_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'category_id', referencedColumnName: 'id' }],
  })
  categories: CategoryEntity[];

  @OneToMany(() => ResponseEntity, (response) => response.order, {
    cascade: true,
  })
  responses: ResponseEntity[];

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.order)
  favorites?: FavoriteEntity[];
}
