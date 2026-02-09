import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationArgs } from '../common/dto/pagination.args';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { IPaginatedType } from '../common/dto/paginated.type';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @ApiOperation({ summary: 'Get all users with pagination' })
  @Get()
  findAll(
    @Query() paginationArgs: PaginationArgs,
  ): Promise<IPaginatedType<User>> {
    // Default values if not provided (although PaginationArgs usually has defaults or is validated)
    if (!paginationArgs.skip) paginationArgs.skip = 0;
    if (!paginationArgs.take) paginationArgs.take = 10;
    
    return this.usersService.findAll(paginationArgs);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
