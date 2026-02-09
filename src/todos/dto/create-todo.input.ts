import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDate, IsUUID } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @ApiProperty({ description: 'The content of the todo', example: 'Buy groceries' })
  @Field(() => String, { description: 'The content of the todo' })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiPropertyOptional({ description: 'Expiration date of the todo', example: '2024-12-31T23:59:59Z' })
  @Field(() => Date, { nullable: true, description: 'Expiration date of the todo' })
  @IsOptional()
  @IsDate({ message: 'ExpiresAt must be a valid date' })
  expiresAt?: Date;

  @ApiPropertyOptional({ description: 'ID of the user to assign the todo to' })
  @Field(() => String, { nullable: true, description: 'ID of the user to assign the todo to' })
  @IsOptional()
  @IsUUID('4', { message: 'UserId must be a valid UUID' })
  userId?: string;
}
