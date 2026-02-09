import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dto/pagination.args';
import { RestPaginationArgs } from '../common/dto/rest-pagination.args';
import { RestUpdateTodoInput } from './dto/rest-update-todo.input';
import { PaginatedTodo } from './dto/paginated-todo.dto';
import { Todo } from './entities/todo.entity';
import { IPaginatedType } from '../common/dto/paginated.type';

@ApiTags('Todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'The todo has been successfully created.', type: Todo })
  @Post()
  create(
    @Body() createTodoInput: CreateTodoInput,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    return this.todosService.create(createTodoInput, user);
  }

  @ApiOperation({ summary: 'Get all todos for current user' })
  @ApiResponse({ status: 200, description: 'Return list of todos', type: PaginatedTodo })
  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() query: RestPaginationArgs,
  ): Promise<IPaginatedType<Todo>> {
    const paginationArgs = new PaginationArgs();
    paginationArgs.take = query.limit;
    paginationArgs.skip = (query.page - 1) * query.limit;
    
    return this.todosService.findAll(user, paginationArgs);
  }

  @ApiOperation({ summary: 'Get todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo UUID' })
  @ApiResponse({ status: 200, description: 'Return the todo', type: Todo })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    return this.todosService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo UUID' })
  @ApiResponse({ status: 200, description: 'Return the updated todo', type: Todo })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() restUpdateTodoInput: RestUpdateTodoInput,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    const updateTodoInput = new UpdateTodoInput();
    Object.assign(updateTodoInput, restUpdateTodoInput);
    updateTodoInput.id = id;
    
    return this.todosService.update(id, updateTodoInput, user);
  }

  @ApiOperation({ summary: 'Delete todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo UUID' })
  @ApiResponse({ status: 200, description: 'Return true if deleted', type: Boolean })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.todosService.remove(id, user);
  }
}
