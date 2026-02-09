
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTodoInput } from './create-todo.input';
import { IsBoolean, IsOptional } from 'class-validator';

export class RestUpdateTodoInput extends PartialType(CreateTodoInput) {
  @ApiPropertyOptional({ description: 'Mark as completed or not', example: true })
  @IsOptional()
  @IsBoolean({ message: 'IsCompleted must be a boolean' })
  isCompleted?: boolean;
}
