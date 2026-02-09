import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { User } from '../users/entities/user.entity';
export declare class TodosResolver {
    private readonly todosService;
    constructor(todosService: TodosService);
    findAll(user: User): Promise<Todo[]>;
    findOne(id: string, user: User): Promise<Todo>;
    createTodo(createTodoInput: CreateTodoInput, user: User): Promise<Todo>;
    updateTodo(updateTodoInput: UpdateTodoInput, user: User): Promise<Todo>;
    removeTodo(id: string, user: User): Promise<boolean>;
}
