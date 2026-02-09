import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { TodosModule } from '../src/todos/todos.module';
import { User } from '../src/users/entities/user.entity';
import { InvalidToken } from '../src/auth/entities/invalid-token.entity';
import { Todo } from '../src/todos/entities/todo.entity';

// Simple UUID v4 generator for testing
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

describe('Todos REST (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

    const db = newDb();
    db.public.registerFunction({
        name: 'uuid_generate_v4',
        implementation: uuidv4,
    });
    db.public.registerFunction({
        name: 'version',
        implementation: () => 'PostgreSQL 14.0',
    });
    db.public.registerFunction({
        name: 'current_database',
        implementation: () => 'test',
    });

    const ds: DataSource = await db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [User, InvalidToken, Todo],
        synchronize: true,
    });
    await ds.initialize();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({}),
            // eslint-disable-next-line @typescript-eslint/require-await
            dataSourceFactory: async () => ds,
        }),
        AuthModule,
        UsersModule,
        TodosModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();
    dataSource = ds;

    // Create a user and login to get token
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Todo User',
        email: 'todo@test.com',
        password: 'password123',
      });
    
    userId = signupRes.body.user.id;
    authToken = signupRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('/todos (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Test Todo',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('content', 'Test Todo');
    expect(response.body).toHaveProperty('isCompleted', false);
    expect(response.body).toHaveProperty('userId', userId);
  });

  it('/todos (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('total', 1);
    expect(response.body.items[0]).toHaveProperty('content', 'Test Todo');
  });

  it('/todos/:id (GET)', async () => {
    // Get the todo ID from the list
    const listRes = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${authToken}`);
    
    const todoId = listRes.body.items[0].id;

    const response = await request(app.getHttpServer())
      .get(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', todoId);
    expect(response.body).toHaveProperty('content', 'Test Todo');
  });

  it('/todos/:id (PATCH)', async () => {
    const listRes = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${authToken}`);
    
    const todoId = listRes.body.items[0].id;

    const response = await request(app.getHttpServer())
      .patch(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        id: todoId,
        content: 'Updated Todo',
        isCompleted: true,
      })
      .expect(200);

    expect(response.body).toHaveProperty('id', todoId);
    expect(response.body).toHaveProperty('content', 'Updated Todo');
    expect(response.body).toHaveProperty('isCompleted', true);
  });

  it('/todos/:id (DELETE)', async () => {
    const listRes = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${authToken}`);
    
    const todoId = listRes.body.items[0].id;

    await request(app.getHttpServer())
      .delete(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Verify it's gone
    await request(app.getHttpServer())
      .get(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });
});
