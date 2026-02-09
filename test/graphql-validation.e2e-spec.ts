import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { randomUUID as uuidv4 } from 'crypto';

import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/entities/user.entity';
import { InvalidToken } from '../src/auth/entities/invalid-token.entity';
import { Todo } from '../src/todos/entities/todo.entity';

describe('GraphQL Validation (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';

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
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            sortSchema: true,
        }),
        AuthModule,
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    dataSource = ds;
  });

  afterAll(async () => {
    await app.close();
    if (dataSource?.isInitialized) await dataSource.destroy();
  });

  it('signup should fail with invalid input', async () => {
    const query = `
      mutation {
        signup(signupInput: {
          name: "",
          email: "invalid-email",
          password: "123"
        }) {
          user {
            id
            email
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body).toHaveProperty('errors');
    const errors = response.body.errors;
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('Bad Request Exception');
    // NestJS ValidationPipe usually returns specific constraints in the extension or message
  });
});
