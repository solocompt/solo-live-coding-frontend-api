import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Todo)
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo], { name: 'todos' })
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User) {
    return this.todosService.findAll(user);
  }

  @Query(() => Todo, { name: 'todo' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.todosService.findOne(id, user);
  }

  @Mutation(() => Todo)
  @UseGuards(JwtAuthGuard)
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
    @CurrentUser() user: User,
  ) {
    return this.todosService.create(createTodoInput, user);
  }

  @Mutation(() => Todo)
  @UseGuards(JwtAuthGuard)
  async updateTodo(
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
    @CurrentUser() user: User,
  ) {
    return this.todosService.update(updateTodoInput.id, updateTodoInput, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removeTodo(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.todosService.remove(id, user);
  }
}
