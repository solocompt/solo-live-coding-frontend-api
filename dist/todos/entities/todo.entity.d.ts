import { User } from '../../users/entities/user.entity';
export declare class Todo {
    id: string;
    content: string;
    isCompleted: boolean;
    expiresAt?: Date;
    user: User;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
