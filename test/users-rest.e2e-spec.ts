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

describe('Users REST (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;

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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();
    dataSource = ds;

    // Create a user and login to get token
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
      });
    
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password123',
      });
    
    authToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('items');
    expect(response.body).toHaveProperty('total');
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeGreaterThan(0);
    expect(response.body.items[0]).not.toHaveProperty('password');
  });

  it('/users/:id (GET)', async () => {
    // Get the user ID from the list
    const listRes = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);
    
    const userId = listRes.body.items[0].id;

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email', 'user@test.com');
    expect(response.body).not.toHaveProperty('password');
  });
});
