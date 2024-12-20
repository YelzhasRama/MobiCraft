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
} from 'typeorm';
import { UserRole } from '../constants/user-role';
import { Gender } from '../constants/gender';
import { CategoryEntity } from './category.entity';
import { PortfolioEntity } from './portfolio.entity';
import { OrderEntity } from './order.entity';
import { ResponseEntity } from './response.entity';
import { ReviewEntity } from './review.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id: number;

  @Column({
    name: 'email',
    type: 'text',
    unique: true,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'text',
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    name: 'name',
    type: 'text',
    nullable: true,
  })
  name: string;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({
    name: 'location',
    type: 'text',
    nullable: true,
  })
  location: string;

  @Column({
    name: 'phone',
    type: 'text',
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'age',
    type: 'integer',
    nullable: true,
  })
  age: number;

  @Column({
    name: 'bio',
    type: 'text',
    nullable: true,
  })
  bio: string;

  @Column({
    name: 'rating',
    type: 'float',
    default: 0,
    nullable: false,
  })
  rating: number;

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

  @OneToMany(() => PortfolioEntity, (portfolio) => portfolio.user, {
    cascade: true,
  })
  portfolios: PortfolioEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.users)
  @JoinTable({
    name: 'user_categories',
    joinColumns: [
      {
        name: 'user_id',
        referencedColumnName: 'id',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'category_id',
        referencedColumnName: 'id',
      },
    ],
  })
  categories?: CategoryEntity[];

  @OneToMany(() => OrderEntity, (order) => order.client, {
    cascade: true,
  })
  orders: OrderEntity[];

  @OneToMany(() => ResponseEntity, (response) => response.mobilograph)
  responses: ResponseEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user, {
    cascade: true,
  })
  reviewsReceived: ReviewEntity[]; // Отзывы, полученные пользователем

  @OneToMany(() => ReviewEntity, (review) => review.reviewer)
  reviewsGiven: ReviewEntity[]; // Отзывы, оставленные пользователем
}
