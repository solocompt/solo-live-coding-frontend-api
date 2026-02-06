# Backend Resolver Creation Guide

This document outlines the standard patterns for creating GraphQL Resolvers in the backend. Resolvers map GraphQL operations (Queries, Mutations) to Service methods.

## Standard Resolver Structure

Resolvers are defined using the `@Resolver()` decorator and handle the incoming GraphQL requests.

### Key Principles

1.  **Decorators**: Use `@Resolver()`, `@Query()`, and `@Mutation()`.
2.  **Guards**: Use `@UseGuards(AuthGuard)` or `@UseGuards(GuestGuard)` to protect endpoints.
3.  **Arguments**: Use `@Args('name')` to extract input data (DTOs).
4.  **Context**: Use custom decorators like `@CurrentUser()` or `@CurrentToken()` to access request context.

### Example Implementation

Based on `src/users/users.resolver.ts` and `src/auth/auth.resolver.ts`:

```typescript
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { UpdateUserInput } from "./dto/update-user.input";
import { AuthGuard } from "../auth/guards/auth/auth.guard";
import { GuestGuard } from "../auth/guards/guest/guest.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // 1. Query (Read)
  // Protected by AuthGuard: Only logged-in users can access
  @Query(() => User)
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: User) {
    // @CurrentUser extracts the user from the request (injected by AuthGuard)
    return user;
  }

  // 2. Mutation (Write/Update)
  // Protected by AuthGuard
  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args("updateUserInput") updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.updateUser(user, updateUserInput);
  }

  // 3. Public Mutation (e.g., Register/Login)
  // Protected by GuestGuard: Only non-logged-in users can access (optional pattern)
  @Mutation(() => User)
  @UseGuards(GuestGuard)
  async register(
    @Args("registerAuthInput") registerInput: any, // Use actual DTO class
  ) {
    return this.usersService.create(registerInput);
  }
}
```

### Decorator Reference

| Decorator                     | Usage                                                |
| :---------------------------- | :--------------------------------------------------- |
| `@Resolver(() => Entity)`     | Marks the class as a resolver for a specific entity. |
| `@Query(() => ReturnType)`    | Defines a GraphQL Query (read-only).                 |
| `@Mutation(() => ReturnType)` | Defines a GraphQL Mutation (write/action).           |
| `@Args('name')`               | Extracts a named argument from the GraphQL request.  |
| `@UseGuards(Guard)`           | Applies an authorization guard (e.g., `AuthGuard`).  |
| `@CurrentUser()`              | Custom decorator to get the authenticated user.      |
| `@CurrentToken()`             | Custom decorator to get the session token.           |

### Testing Resolvers

Resolvers should be tested using integration tests with `pg-mem` to simulate the database.

Based on `src/auth/auth.resolver.spec.ts`:

1.  **Setup**: create a `TestingModule` with `TypeOrmModule` using a `pg-mem` DataSource.
2.  **Mocking**: Register postgres functions (`uuid_generate_v4`, `version`) in `pg-mem`.
3.  **Execution**: Call resolver methods directly (`resolver.mutationName(...)`).
4.  **Verification**: Assert the result and check the state of the in-memory database.

```typescript
// Simplified Test Structure
describe("UsersResolver", () => {
  let resolver: UsersResolver;
  let dataSource: DataSource;

  beforeEach(async () => {
    // ... setup pg-mem and module ...
  });

  it("should update user", async () => {
    // 1. Seed DB
    // 2. Call resolver.updateUser(...)
    // 3. Expect result matches
    // 4. Verify DB change
  });
});
```