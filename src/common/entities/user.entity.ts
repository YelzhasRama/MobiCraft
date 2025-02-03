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
  OneToOne,
} from 'typeorm';
import { UserRole } from '../constants/user-role';
import { Gender } from '../constants/gender';
import { CategoryEntity } from './category.entity';
import { PortfolioEntity } from './portfolio.entity';
import { OrderEntity } from './order.entity';
import { ResponseEntity } from './response.entity';
import { ReviewEntity } from './review.entity';
import { UserProfileImageEntity } from './user-profile-image.entity';
import { AccessoryEntity } from './accessory.entity';
import { UserVideosEntity } from './user-videos.entity';
import { FavoriteEntity } from './favorite.entity';
import { DeviceEntity } from './device.entity';

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
    name: 'open_id',
    type: 'text',
    unique: true,
    nullable: true, // Делаем необязательным
  })
  openId: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    nullable: true,
  })
  role: UserRole;

  @Column({
    name: 'name',
    type: 'text',
    nullable: true,
  })
  name: string;

  @Column({
    name: 'full_name',
    type: 'text',
    nullable: true,
  })
  fullName: string;

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
    name: 'where_am_i',
    type: 'text',
    nullable: true,
  })
  whereAmI: string;

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

  @Column({
    name: 'service_price',
    type: 'text',
    nullable: true,
  })
  servicePrice: string;

  @Column({
    name: 'price_unit',
    type: 'text',
    nullable: true,
  })
  priceUnit: string;

  @Column({
    name: 'device',
    type: 'text',
    nullable: true,
  })
  device: string;

  @Column({
    name: 'avatar_url',
    type: 'text',
    nullable: true,
  })
  avatarUrl: string;

  @Column({
    name: 'email_verified_at',
    type: 'timestamptz',
    nullable: true,
  })
  emailVerifiedAt: string | null;

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
  reviewsReceived: ReviewEntity[]; // Пользователь, которому оставлен отзыв

  @OneToMany(() => ReviewEntity, (review) => review.reviewer)
  reviewsGiven: ReviewEntity[]; // Пользователь, которому оставлен отзыв

  @OneToOne(() => UserProfileImageEntity, (profileImage) => profileImage.user, {
    cascade: true,
  })
  profileImage?: UserProfileImageEntity;

  @ManyToMany(() => AccessoryEntity, (accessory) => accessory.users)
  accessories: AccessoryEntity[];

  @OneToMany(() => UserVideosEntity, (userVideo) => userVideo.user, {
    cascade: true,
  })
  videos: UserVideosEntity[];

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.user)
  favorites?: FavoriteEntity[];

  @ManyToMany(() => DeviceEntity, (device) => device.users)
  devices: DeviceEntity[];
}
