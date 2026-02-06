import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsDate, IsUUID } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field(() => String, { description: 'The content of the todo' })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @Field(() => Date, { nullable: true, description: 'Expiration date of the todo' })
  @IsOptional()
  @IsDate({ message: 'ExpiresAt must be a valid date' })
  expiresAt?: Date;

  @Field(() => String, { nullable: true, description: 'ID of the user to assign the todo to' })
  @IsOptional()
  @IsUUID('4', { message: 'UserId must be a valid UUID' })
  userId?: string;
}
