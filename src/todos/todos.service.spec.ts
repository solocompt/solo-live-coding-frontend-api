import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Todo } from './entities/todo.entity';
import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { UsersService } from '../users/users.service';
import { randomUUID } from 'crypto';

describe('TodosService (Integration)', () => {
  let service: TodosService;
  let usersService: UsersService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const db = newDb();

    // Register required Postgres functions
    db.public.registerFunction({
      name: 'uuid_generate_v4',
      implementation: randomUUID,
    });
    db.public.registerFunction({
      name: 'version',
      implementation: () => 'PostgreSQL 14.0',
    });
    db.public.registerFunction({
      name: 'current_database',
      implementation: () => 'test',
    });

    // Create and sync DataSource manually
    const ds: DataSource = await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [User, Todo],
    });
    await ds.initialize();
    await ds.synchronize();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({}),
          dataSourceFactory: async () => ds,
        }),
        TypeOrmModule.forFeature([User, Todo]),
      ],
      providers: [TodosService, UsersService],
    }).compile();

    service = module.get<TodosService>(TodosService);
    usersService = module.get<UsersService>(UsersService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should create and retrieve a todo', async () => {
    // First create a user manually to avoid Service ID generation issues
    const userRepo = dataSource.getRepository(User);
    const user = await userRepo.save({
      id: randomUUID(),
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
    });

    // Create todo
    const todo = await service.create({
      content: 'Test Todo',
    }, user);

    expect(todo.id).toBeDefined();
    expect(todo.content).toBe('Test Todo');
    expect(todo.userId).toBe(user.id);

    // Retrieve todo
    const foundTodo = await service.findOne(todo.id, user);
    expect(foundTodo.id).toBe(todo.id);
  });

  it('should assign todo to another user', async () => {
    const userRepo = dataSource.getRepository(User);
    const user1 = await userRepo.save({
      id: randomUUID(),
      name: 'User 1',
      email: 'user1@example.com',
      password: 'Password123!',
    });

    const user2 = await userRepo.save({
      id: randomUUID(),
      name: 'User 2',
      email: 'user2@example.com',
      password: 'Password123!',
    });

    // User 1 creates todo for User 2
    const todo = await service.create({
      content: 'Assigned Todo',
      userId: user2.id,
    }, user1);

    expect(todo.userId).toBe(user2.id);

    // User 2 should be able to find it
    const foundTodo = await service.findOne(todo.id, user2);
    expect(foundTodo.content).toBe('Assigned Todo');
  });
});
