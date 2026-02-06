import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginatedUser } from './dto/paginated-user.object';
import { PaginationArgs } from '../common/dto/pagination.args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => PaginatedUser, { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll(@Args() paginationArgs: PaginationArgs) {
    return this.usersService.findAll(paginationArgs);
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }
}
