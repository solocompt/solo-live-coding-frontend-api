
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

describe('Auth Fallback Logic (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;

  beforeAll(async () => {
    // ENSURE NO JWT SECRET IS SET IN ENV
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;

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
        // Load config but ignore env file, and since we deleted env vars, it should be empty
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({}),
            dataSourceFactory: async () => ds,
        }),
        AuthModule,
        UsersModule,
        TodosModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();
    dataSource = ds;
  });

  afterAll(async () => {
    await app.close();
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('should allow login and access protected route using fallback secret', async () => {
    // 1. Signup
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Fallback User',
        email: 'fallback@test.com',
        password: 'password123',
      })
      .expect(201);

    authToken = signupRes.body.accessToken;
    expect(authToken).toBeDefined();

    // 2. Access protected route (create todo)
    await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Test Todo with Fallback Secret',
      })
      .expect(201);
  });
});
