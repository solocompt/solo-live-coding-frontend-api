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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dto/pagination.args';
import { Todo } from './entities/todo.entity';
import { IPaginatedType } from '../common/dto/paginated.type';

@ApiTags('Todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiOperation({ summary: 'Create a new todo' })
  @Post()
  create(
    @Body() createTodoInput: CreateTodoInput,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    return this.todosService.create(createTodoInput, user);
  }

  @ApiOperation({ summary: 'Get all todos for current user' })
  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() paginationArgs: PaginationArgs,
  ): Promise<IPaginatedType<Todo>> {
    // Default values if not provided
    if (!paginationArgs.skip) paginationArgs.skip = 0;
    if (!paginationArgs.take) paginationArgs.take = 10;
    
    return this.todosService.findAll(user, paginationArgs);
  }

  @ApiOperation({ summary: 'Get todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo UUID' })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    return this.todosService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo UUID' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoInput: UpdateTodoInput,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    // Ensure the ID in the body matches the URL or just use the ID from URL
    updateTodoInput.id = id;
    return this.todosService.update(id, updateTodoInput, user);
  }

  @ApiOperation({ summary: 'Delete todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo UUID' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.todosService.remove(id, user);
  }
}
