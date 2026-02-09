
import { ApiProperty } from '@nestjs/swagger';
import { Todo } from '../entities/todo.entity';
import { IPaginatedType } from '../../common/dto/paginated.type';

export class PaginatedTodo implements IPaginatedType<Todo> {
    @ApiProperty({ type: [Todo] })
    items: Todo[];
    
    @ApiProperty()
    total: number;
    
    @ApiProperty()
    hasNextPage: boolean;
}
