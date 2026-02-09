import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PaginationArgs } from '../common/dto/pagination.args';
import { IPaginatedType } from '../common/dto/paginated.type';
export declare class TodosService {
    private todosRepository;
    private usersService;
    constructor(todosRepository: Repository<Todo>, usersService: UsersService);
    create(createTodoInput: CreateTodoInput, currentUser: User): Promise<Todo>;
    findAll(user: User, paginationArgs: PaginationArgs): Promise<IPaginatedType<Todo>>;
    findOne(id: string, user: User): Promise<Todo>;
    update(id: string, updateTodoInput: UpdateTodoInput, user: User): Promise<Todo>;
    remove(id: string, user: User): Promise<boolean>;
}
