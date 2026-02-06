import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
  password: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
