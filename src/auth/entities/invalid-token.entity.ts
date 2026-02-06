import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class InvalidToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;
}
