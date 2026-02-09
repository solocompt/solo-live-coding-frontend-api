import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginatedTodo } from './dto/paginated-todo.object';
import { PaginationArgs } from '../common/dto/pagination.args';

@Resolver(() => Todo)
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => PaginatedTodo, { name: 'todos', description: 'Get all todos with pagination' })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.todosService.findAll(user, paginationArgs);
  }

  @Query(() => Todo, { name: 'todo', description: 'Get a specific todo by ID' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.todosService.findOne(id, user);
  }

  @Mutation(() => Todo, { description: 'Create a new todo' })
  @UseGuards(JwtAuthGuard)
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
    @CurrentUser() user: User,
  ) {
    return this.todosService.create(createTodoInput, user);
  }

  @Mutation(() => Todo, { description: 'Update an existing todo' })
  @UseGuards(JwtAuthGuard)
  async updateTodo(
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
    @CurrentUser() user: User,
  ) {
    return this.todosService.update(updateTodoInput.id, updateTodoInput, user);
  }

  @Mutation(() => Boolean, { description: 'Delete a todo by ID' })
  @UseGuards(JwtAuthGuard)
  async removeTodo(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.todosService.remove(id, user);
  }
}
