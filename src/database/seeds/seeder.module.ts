import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../../users/users.module';
import { TodosModule } from '../../todos/todos.module';
import { UserSeeder } from './test/user.seeder';
import { TodoSeeder } from './test/todo.seeder';
import { AppDataSource } from '../../data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: 'src/database/database.sqlite',
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    TodosModule,
  ],
  providers: [UserSeeder, TodoSeeder],
})
export class SeederModule {}
