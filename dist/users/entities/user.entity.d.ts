import { Todo } from '../../todos/entities/todo.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    currentHashedRefreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    todos: Todo[];
}
