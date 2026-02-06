# Backend Testing Documentation

This document outlines the testing strategy, patterns, and examples for the backend application.

## Testing Strategy

We support two levels of testing:

1.  **Integration Tests (pg-mem)**: **RECOMMENDED** for Resolvers, Services, and Repositories to verify actual database interactions and full-stack flow using an in-memory PostgreSQL simulation.
2.  **Unit Tests (Mocks)**: For isolated logic validation (Guards, Helpers) where database interaction is not the primary focus.

### Why Integration Tests for Resolvers & Services?

While mocks are fast, they don't verify that your queries (TypeORM) actually work with a real database. Using `pg-mem` (in-memory PostgreSQL) provides a high confidence level ("fully working") and avoids SQLite compatibility issues when using Postgres-specific features.

## 1. Integration Tests with pg-mem (Recommended)

Use `pg-mem` to simulate a PostgreSQL database in memory. This ensures entities are saved, relationships are handled, and constraints are respected, mimicking the production environment closer than SQLite.

**Prerequisites**: `npm install pg-mem --save-dev`

### Setup Pattern

1.  Create a `newDb()` instance from `pg-mem`.
2.  Register necessary functions (e.g., `uuid_generate_v4`, `version`, `current_database`).
3.  Create and initialize the `DataSource` manually using `db.adapters.createTypeormDataSource`.
4.  Pass the initialized `DataSource` to `TypeOrmModule` via `dataSourceFactory`.

### Example: UsersService Integration Test

```typescript
// src/users/users.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Session } from "../auth/entities/sessions.entity";
import { newDb } from "pg-mem";
import { v4 as uuidv4 } from "uuid";
import { DataSource } from "typeorm";

describe("UsersService (Integration)", () => {
  let service: UsersService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const db = newDb();

    // Register required Postgres functions
    db.public.registerFunction({
      name: "uuid_generate_v4",
      implementation: uuidv4,
    });
    db.public.registerFunction({
      name: "version",
      implementation: () => "PostgreSQL 14.0",
    });
    db.public.registerFunction({
      name: "current_database",
      implementation: () => "test",
    });

    // Create and sync DataSource manually
    const ds: DataSource = await db.adapters.createTypeormDataSource({
      type: "postgres",
      entities: [User, Session],
    });
    await ds.initialize();
    await ds.synchronize();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({}),
          dataSourceFactory: async () => ds,
        }),
        TypeOrmModule.forFeature([User, Session]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should create and retrieve a user", async () => {
    // This actually saves to the in-memory DB!
    const savedUser = await service.create({
      email: "test@test.com",
      password: "123",
    });
    expect(savedUser.id).toBeDefined();

    const foundUser = await service.findOne(savedUser.id);
    expect(foundUser.email).toBe("test@test.com");
  });
});
```

---

## 2. Unit Tests with Mocks (Guards)

Use mocks for Guards where we need to simulate execution context and dependencies (like `AuthService` or `Reflector`) without spinning up a database.

### Mocking Execution Context

```typescript
const mockGqlExecutionContext = {
  getContext: jest.fn(),
  getHandler: jest.fn(),
  getClass: jest.fn(),
};

// Mock the static create method
jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlExecutionContext as any);
```

### Mocking Dependencies

```typescript
const mockAuthService = {
  validateSession: jest.fn(),
};
```

### Example: AuthGuard Test

```typescript
// src/auth/guards/auth/auth.guard.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  const mockAuthService = {
    validateSession: jest.fn(),
  };
  const mockGqlExecutionContext = {
    getContext: jest.fn(),
  };

  const mockExecutionContext = {} as any; // Standard ExecutionContext

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);

    // Mock GqlExecutionContext.create
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlExecutionContext as any);
  });

  it('should return true if token is valid', async () => {
    const user = { id: 'user-id', email: 'test@test.com' };
    const req = {
      headers: { authorization: 'Bearer valid-token' },
      user: null,
      token: null,
    };

    mockGqlExecutionContext.getContext.mockReturnValue({ req });
    mockAuthService.validateSession.mockResolvedValue(user);

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(req.user).toBe(user);
    expect(req.token).toBe('valid-token');
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const req = {
      headers: { authorization: 'Bearer invalid-token' },
    };

    mockGqlExecutionContext.getContext.mockReturnValue({ req });
    mockAuthService.validateSession.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
  });
});
```