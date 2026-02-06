# Backend Service Creation Guide

This document outlines the standard patterns for creating Services in the backend. Services contain the core business logic and interact with the database via TypeORM repositories.

## Standard Service Structure

Services are NestJS providers marked with `@Injectable()`. They isolate business logic from the GraphQL layer (Resolvers).

### Key Principles

1.  **Dependency Injection**: Use `@Injectable()` and inject TypeORM repositories.
2.  **Repositories**: Use `@InjectRepository(Entity)` to access database operations.
3.  **Strict Typing**: NEVER use `any` type for method arguments, especially for update data. ALWAYS use the specific DTO (e.g., `UpdateUserInput`) to ensure type safety and validation.
4.  **Business Logic**: Handle calculations, password hashing (`bcrypt`), and data transformations here.
5.  **Error Handling**: Throw standard exceptions (e.g., `Error`, `UnauthorizedException`) which GraphQL will format.
6.  **Inline Comments**: Mandatory inline comments in functions and methods to clarify complex logic or important steps.

### Example Implementation

Based on `src/users/users.service.ts` and `src/auth/auth.service.ts`:

```typescript
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input"; // Example DTO
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 1. Read Operation
  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // 2. Create Operation (with hashing)
  async create(createUserInput: CreateUserInput) {
    // Check uniqueness
    const existing = await this.findOne(createUserInput.email);
    if (existing) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

    // Create and Save
    const user = this.usersRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  // 3. Update Operation
  async update(user: User, updateUserInput: UpdateUserInput) {
    // Separate logic if needed (e.g., prevent password update via generic method)
    const { password, ...dataToUpdate } = updateUserInput;

    // Save performs an update if ID exists
    await this.usersRepository.save({
      ...dataToUpdate,
      id: user.id,
    });

    // Return updated structure
    return {
      ...user, // Original data
      ...dataToUpdate, // Overwritten data
    };
  }

  // 4. Delete/Custom Operation
  async remove(id: string) {
    await this.usersRepository.delete(id);
    return true;
  }
}
```

### Best Practices

- **Slim Resolvers, Fat Services**: Keep resolvers simple (parsing args, checking guards) and put logic in services.
- **Transactions**: If multiple DB operations must succeed together, use `QueryRunner` or `transaction` methods (though simple operations use `save`).
- **Password Handling**: Never save plain-text passwords. Use `bcrypt.hash` (async) or `bcrypt.hashSync` (sync) with a salt round of 10.
- **Validation**: Input validation happens in DTOs (class-validator), but business rule validation (e.g., "email already taken") happens in the Service.
- **Code Documentation**: Add inline comments to explain _why_ something is done, especially for logic involving relations, data transformation, or external calls.