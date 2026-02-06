import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Todo id' })
  id: string;

  @Column('varchar', { length: 255 })
  @Field(() => String, { description: 'Todo content' })
  content: string;

  @Column('boolean', { default: false })
  @Field(() => Boolean, { description: 'Is todo completed', defaultValue: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  @Field(() => Date, { description: 'Expiration date', nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Field(() => User, { description: 'Owner of the todo' })
  user: User;

  @Column()
  @Field(() => String, { description: 'User ID' })
  userId: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
