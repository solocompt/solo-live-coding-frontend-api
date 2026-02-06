# Backend Entity Creation Guide

This document outlines the standard patterns for creating TypeORM entities in the backend, integrated with NestJS GraphQL.

## Standard Entity Structure

Entities define both the database schema (via TypeORM) and the GraphQL object type (via NestJS GraphQL).

### Key Principles

1.  **Dual Decorators**: Use both TypeORM (`@Entity`, `@Column`) and GraphQL (`@ObjectType`, `@Field`) decorators.
2.  **Naming Convention**:
    - Class name: PascalCase (e.g., `User`).
    - File name: `kebab-case.entity.ts` (e.g., `user.entity.ts`).
    - Table name: snake_case plural (e.g., `users`).
3.  **Primary Key**: Use UUIDs for IDs.
4.  **Documentation**: Always provide a `description` in `@Field` for GraphQL documentation.

### Example Implementation

Based on `src/users/entities/user.entity.ts`:

```typescript
import { ObjectType, Field, Int } from '@nestjs/graphql'; // GraphQL decorators
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm'; // TypeORM decorators
// Import related entities if needed
import { Session } from '../../auth/entities/sessions.entity';

@ObjectType() // Marks class as a GraphQL Object Type
@Entity('users') // Defines the database table name
export class User {
  // 1. Primary Key (UUID)
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'User id' })
  id: string;

  // 2. Standard Column
  @Column('varchar', { length: 100 })
  @Field(() => String, { description: 'User name', nullable: false })
  name: string;

  // 3. Nullable Column
  @Column('varchar', { length: 100, nullable: true })
  @Field(() => String, { description: 'User surname' }) // GraphQL field is implicitly nullable if typescript type is optional or if nullable: true is set (though here it's just omitted which usually means nullable in GQL if not strictly controlled)
  surname: string;

  // 4. Unique Column & Index
  @Column('varchar', { length: 100, unique: true })
  @Index('IDX_USER_EMAIL') // Explicit index for faster lookups
  @Field(() => String, { description: 'User email' })
  email: string;

  // 5. Internal Column (Not exposed to GraphQL)
  // Note: No @Field decorator here, so it won't appear in the API
  @Column('varchar', { length: 255 })
  password: string;

  // 6. Relationships
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
```

### Decorator Reference

| Category   | Decorator                         | Usage                                                                           |
| :--------- | :-------------------------------- | :------------------------------------------------------------------------------ |
| **Class**  | `@ObjectType()`                   | Exposes the entity as a GraphQL type.                                           |
|            | `@Entity('table_name')`           | Maps the class to a database table.                                             |
| **ID**     | `@PrimaryGeneratedColumn('uuid')` | Generates a UUID primary key.                                                   |
| **Field**  | `@Field(() => Type, options)`     | Exposes a property to GraphQL. `options` include `{ description, nullable }`.   |
| **Column** | `@Column(type, options)`          | Defines a DB column. `options` include `{ length, unique, nullable, default }`. |
| **Index**  | `@Index('index_name')`            | Creates a database index for performance. Mandatory for searchable fields.      |

### Enums

When using Enums in entities, follow this pattern to ensure they are correctly registered with GraphQL and mapped in TypeORM.

**1. Define the Enum**
Create the enum in a separate file (e.g., `src/posts/enums/post-status.enum.ts`) and register it using `registerEnumType`.

```typescript
import { registerEnumType } from '@nestjs/graphql';

export enum PostStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  INACTIVE = 'inactive',
}

registerEnumType(PostStatus, {
  name: 'PostStatus',
  description: 'The status of the post',
});
```

**2. Use in Entity**
Use the enum in your entity with the `type: 'enum'` option for TypeORM and the enum type for GraphQL.

```typescript
import { PostStatus } from '../enums/post-status.enum';

@Column({
  type: 'enum',
  enum: PostStatus,
  default: PostStatus.DRAFT,
})
@Field(() => PostStatus, { description: 'Post status' })
status: PostStatus;
```

### Relationships

When defining relationships (OneToMany, ManyToOne, etc.):

1.  Import the related entity.
2.  Use the TypeORM relationship decorator.
3.  If the relationship should be traversable in GraphQL, add the `@Field(() => [RelatedEntity])` or `@Field(() => RelatedEntity)` decorator (though often relationships are handled via specialized resolvers or DTOs to avoid circular dependency issues, the entity definition itself primarily focuses on the DB structure).

### Best Practices

- **Descriptions**: Always add `{ description: '...' }` to `@Field` to ensure the GraphQL API is self-documenting.
- **Validation**: While entities enforce database constraints (like `length`), input validation should be handled in DTOs (see `doc-dto.md`).
- **Secrets**: Do **not** add `@Field` to sensitive columns like `password`.
