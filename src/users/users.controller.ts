import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationArgs } from '../common/dto/pagination.args';
import { User } from './entities/user.entity';
import { IPaginatedType } from '../common/dto/paginated.type';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query() paginationArgs: PaginationArgs,
  ): Promise<IPaginatedType<User>> {
    // Default values if not provided (although PaginationArgs usually has defaults or is validated)
    if (!paginationArgs.skip) paginationArgs.skip = 0;
    if (!paginationArgs.take) paginationArgs.take = 10;
    
    return this.usersService.findAll(paginationArgs);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
