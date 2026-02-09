import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { newDb } from 'pg-mem';
import { randomUUID as uuidv4 } from 'crypto';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthResolver } from '../src/auth/auth.resolver';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/users/entities/user.entity';
import { Todo } from '../src/todos/entities/todo.entity';

describe('Auth Integration (pg-mem)', () => {
  let resolver: AuthResolver;
  let dataSource: DataSource;
  let module: TestingModule;

  beforeAll(async () => {
    // Set environment variables for testing
    process.env.JWT_SECRET = 'test-secret';

    const db = newDb();

    // Register Postgres functions
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ds: DataSource = await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [User, Todo],
      synchronize: true,
    });
    await ds.initialize();

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({}),
          // eslint-disable-next-line @typescript-eslint/require-await
          dataSourceFactory: async () => ds,
        }),
        UsersModule,
        AuthModule,
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await module.close();
  });

  it('should signup a new user', async () => {
    const result = await resolver.signup({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBeDefined();
  });

  it('should login the user', async () => {
    const result = await resolver.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBeDefined();
  });

  it('should fail login with wrong password', async () => {
    await expect(
      resolver.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow();
  });
});
