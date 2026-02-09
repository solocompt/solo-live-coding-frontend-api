import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosService } from './todos.service';
import { TodosResolver } from './todos.resolver';
import { TodosController } from './todos.controller';
import { Todo } from './entities/todo.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UsersModule],
  controllers: [TodosController],
  providers: [TodosResolver, TodosService],
  exports: [TodosService],
})
export class TodosModule {}
