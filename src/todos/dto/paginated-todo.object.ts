import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/dto/paginated.type';
import { Todo } from '../entities/todo.entity';

@ObjectType()
export class PaginatedTodo extends Paginated(Todo) {}
