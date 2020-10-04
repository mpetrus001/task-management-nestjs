import { User } from 'src/auth/users.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: 'OPEN' | 'IN_PROGESS' | 'DONE';

  @ManyToOne(
    () => User,
    user => user.tasks,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;
}
