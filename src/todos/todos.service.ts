import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
    private usersService: UsersService,
  ) {}

  // Create Todo
  async create(createTodoInput: CreateTodoInput, currentUser: User): Promise<Todo> {
    let targetUser = currentUser;

    // If userId is provided, we try to find that user
    if (createTodoInput.userId) {
      targetUser = await this.usersService.findOne(createTodoInput.userId);
    }

    const todo = this.todosRepository.create({
      ...createTodoInput,
      user: targetUser,
      userId: targetUser.id,
    });

    return this.todosRepository.save(todo);
  }

  // Find All for a user
  async findAll(user: User): Promise<Todo[]> {
    return this.todosRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  // Find One
  async findOne(id: string, user: User): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    
    // Check if the todo belongs to the user
    if (todo.userId !== user.id) {
       throw new ForbiddenException('You do not have permission to access this todo');
    }
    return todo;
  }

  // Update
  async update(id: string, updateTodoInput: UpdateTodoInput, user: User): Promise<Todo> {
    const todo = await this.findOne(id, user); // checks existence and permission

    // Update fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateTodoInput;
    
    Object.assign(todo, updateData);

    return this.todosRepository.save(todo);
  }

  // Remove
  async remove(id: string, user: User): Promise<boolean> {
    const todo = await this.findOne(id, user); // checks existence and permission
    await this.todosRepository.remove(todo);
    return true;
  }
}
