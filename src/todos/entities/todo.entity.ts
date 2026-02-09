import { ObjectType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Todo id' })
  id: string;

  @Column('varchar', { length: 255 })
  @Field(() => String, { description: 'Todo content' })
  @ApiProperty({ description: 'Todo content' })
  content: string;

  @Column('boolean', { default: false })
  @Field(() => Boolean, { description: 'Is todo completed', defaultValue: false })
  @ApiProperty({ description: 'Is todo completed', default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  @Field(() => Date, { description: 'Expiration date', nullable: true })
  @ApiProperty({ description: 'Expiration date', required: false, nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Field(() => User, { description: 'Owner of the todo' })
  @ApiProperty({ description: 'Owner of the todo', type: () => User })
  user: User;

  @Column()
  @Field(() => String, { description: 'User ID' })
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @CreateDateColumn()
  @Field(() => Date, { description: 'Creation date' })
  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date, { description: 'Last update date' })
  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
