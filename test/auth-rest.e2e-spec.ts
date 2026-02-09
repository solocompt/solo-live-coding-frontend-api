import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { newDb } from 'pg-mem';
import { randomUUID as uuidv4 } from 'crypto';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/entities/user.entity';
import { InvalidToken } from '../src/auth/entities/invalid-token.entity';
import { Todo } from '../src/todos/entities/todo.entity';

describe('Auth REST (e2e)', () => {
  let app: INestApplication;
  let db: any;

  beforeEach(async () => {
    db = newDb({
        autoCreateForeignKeyIndices: true,
    });

    db.public.registerFunction({
        name: 'uuid_generate_v4',
        implementation: () => uuidv4(),
    });
    db.public.registerFunction({
        name: 'version',
        implementation: () => 'PostgreSQL 14.0',
    });
    db.public.registerFunction({
        name: 'current_database',
        implementation: () => 'test',
    });

    const ds = await db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [User, InvalidToken, Todo],
    });
    await ds.initialize();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({
                JWT_SECRET: 'test-secret',
                JWT_EXPIRATION: '15m',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_REFRESH_EXPIRATION: '7d',
            })],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({}),
            dataSourceFactory: async () => ds,
        }),
        AuthModule,
        UsersModule,
      ],
    })
    .overrideProvider(DataSource)
    .useValue(ds)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();
    
    await ds.synchronize();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/signup (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Test REST',
        email: 'rest@test.com',
        password: 'password123',
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', 'rest@test.com');
    // Check if password is excluded
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.user).not.toHaveProperty('currentHashedRefreshToken');
  });

  it('/auth/signup (POST) - validation error', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: '', // Invalid: empty
        email: 'invalid-email', // Invalid: not an email
        password: '123', // Invalid: too short (assuming min length)
      })
      .expect(400);

    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('/auth/signup (POST) - duplicate email', async () => {
    // First create a user
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Duplicate Test',
        email: 'duplicate@test.com',
        password: 'password123',
      })
      .expect(201);

    // Try to create the same user again
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Duplicate Test 2',
        email: 'duplicate@test.com',
        password: 'password123',
      })
      .expect(400);

    expect(response.body).toHaveProperty('statusCode', 400);
    expect(response.body).toHaveProperty('message', 'Email already in use');
  });

  it('/auth/login (POST)', async () => {
    // Create user first
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Login Test',
        email: 'login@test.com',
        password: 'password123',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'login@test.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user).toHaveProperty('email', 'login@test.com');
  });

  it('/auth/me (GET)', async () => {
    // Create user and get token
    await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
        name: 'Me Test',
        email: 'me@test.com',
        password: 'password123',
        })
        .expect(201);

    const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
        email: 'me@test.com',
        password: 'password123',
        })
        .expect(200);
    
    const myToken = loginResponse.body.accessToken;

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${myToken}`)
      .expect(200);
    
    expect(response.body).toHaveProperty('email', 'me@test.com');
  });
});
