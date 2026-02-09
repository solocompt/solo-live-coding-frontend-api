import { CreateTodoInput } from './create-todo.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @ApiProperty({ description: 'The id of the todo', example: 'uuid-string' })
  @Field(() => String, { description: 'The id of the todo' })
  @IsUUID('4', { message: 'Id must be a valid UUID' })
  id: string;

  @ApiPropertyOptional({ description: 'Mark as completed or not', example: true })
  @Field(() => Boolean, { nullable: true, description: 'Mark as completed or not' })
  @IsOptional()
  @IsBoolean({ message: 'IsCompleted must be a boolean' })
  isCompleted?: boolean;
}
