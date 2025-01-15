import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('accessories')
export class AccessoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  name: string; // Название аксессуара, например, "Saramonic"

  @ManyToMany(() => UserEntity, (user) => user.accessories)
  @JoinTable({
    name: 'user_accessories',
    joinColumns: [{ name: 'accessory_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
  })
  users: UserEntity[];
}
