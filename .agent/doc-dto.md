# Backend DTO Creation Guide

This document outlines the standard patterns for creating Data Transfer Objects (DTOs) in the backend, specifically for GraphQL inputs.

## Standard DTO Structure

DTOs are used to define the shape of data sent from the client (Input Types). They combine GraphQL schema definitions with `class-validator` rules.

### Key Principles

1.  **Decorators**: Use `@InputType` and `@Field` from `@nestjs/graphql`.
2.  **Validation**: Use decorators from `class-validator` for all fields.
3.  **Inheritance**: Use `PartialType`, `OmitType`, or `PickType` from `@nestjs/graphql` to reuse DTOs.
4.  **Messages**: Always provide user-friendly error messages in validator options.

### Example Implementation

#### 1. Standard Input DTO (e.g., Registration)

Based on `src/auth/dto/register-auth.input.ts` and `src/users/dto/password-change-user.ts`:

```typescript
import { InputType, Field, Int } from "@nestjs/graphql";
import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  Matches,
  Validate,
} from "class-validator";
// Import custom validators if needed
import { MatchPasswords } from "../validators/match-passwords.validator";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @Field(() => String)
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  // Password with strict validation regex
  @Field(() => String)
  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Password is required" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    },
  )
  password: string;

  // Password confirmation with custom validator
  @Field(() => String)
  @IsString({ message: "Password confirmation must be a string" })
  @MinLength(8, {
    message: "Password confirmation must be at least 8 characters long",
  })
  @IsNotEmpty({ message: "Password confirmation is required" })
  @Validate(MatchPasswords, ["password"], {
    message: "Password confirmation must match password",
  })
  passwordConfirmation: string;
}
```

#### 2. Update DTO (Extending/Partial)

Based on `src/users/dto/update-user.input.ts`:

```typescript
import { RegisterAuthInput } from "../../auth/dto/register-auth.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
// PartialType makes all fields from the parent class optional
export class UpdateUserInput extends PartialType(RegisterAuthInput) {
  // You can add additional fields specific to the update operation here if needed
  // Or override properties
}
```

### Common Validators

| Decorator         | Usage                                                     | Example Message                                 |
| :---------------- | :-------------------------------------------------------- | :---------------------------------------------- |
| `@IsString()`     | Checks if value is a string.                              | `'Name must be a string'`                       |
| `@IsNotEmpty()`   | Checks if value is not empty/null/undefined.              | `'Name is required'`                            |
| `@IsEmail()`      | Checks for valid email format.                            | `'Please provide a valid email address'`        |
| `@MinLength(n)`   | Enforces minimum string length.                           | `'Password must be at least 8 characters long'` |
| `@Matches(regex)` | Enforces regex pattern.                                   | (See password example)                          |
| `@IsOptional()`   | Marks the field as optional (use with nullable `@Field`). | -                                               |

### Best Practices

- **Explicit Messages**: Don't rely on default validation messages. Provide clear, user-facing strings in the `{ message: '...' }` option.
- **Password Complexity**: Use the standard regex pattern for passwords:
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$`
- **Code Reuse**: Avoid duplicating field definitions. Create a base DTO (like `RegisterAuthInput`) and extend it using `PartialType` for updates or `PickType` for specific subsets.
- **GraphQL Types**: Ensure `@Field(() => Type)` matches the TypeScript type. Use `Int` for integers, `Float` for floating-point numbers, and `String` for text.