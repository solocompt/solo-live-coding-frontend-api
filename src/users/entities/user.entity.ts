import { ObjectType, Field } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Todo } from '../../todos/entities/todo.entity';

@ObjectType()
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'User id' })
  id: string;

  @Column('varchar', { length: 100 })
  @Field(() => String, { description: 'User name' })
  name: string;

  @Column('varchar', { length: 100, unique: true })
  @Field(() => String, { description: 'User email' })
  email: string;

  @Column('varchar', { length: 255 })
  // No @Field decorator here, password should not be exposed via GraphQL
  // @Exclude() decorator ensures this field is never returned in REST API responses (JSON)
  @Exclude()
  password: string;

  @Column({ nullable: true })
  // @Exclude() decorator ensures this field is never returned in REST API responses (JSON)
  @Exclude()
  currentHashedRefreshToken?: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @OneToMany(() => Todo, (todo) => todo.user)
  @Field(() => [Todo], { nullable: true })
  todos: Todo[];
}
