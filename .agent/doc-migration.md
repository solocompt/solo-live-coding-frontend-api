# Database Migrations Documentation

This project uses **TypeORM** for database migrations. Migrations are essential for managing database schema changes over time in a version-controlled and reproducible way.

## Overview

- **Library**: TypeORM
- **Configuration**: `src/database/typeorm.config.ts`
- **Migrations Location**: `src/database/migrations`
- **Entities Location**: `src/**/*.entity.ts`

## Commands

All commands are run from the `backend` directory.

### 1. Generate a Migration

Use this command when you have made changes to your entity files (e.g., created a new entity or modified columns) and want to generate a migration file automatically.

```bash
npm run migration:generate --name=NameOfMigration
```

**Example:**

```bash
npm run migration:generate --name=CreateUserTable
```

This will create a new timestamped file in `src/database/migrations` containing the SQL to apply (`up`) and revert (`down`) the changes.

### 2. Run Migrations

Use this command to apply all pending migrations to the database.

```bash
npm run migration:run
```

This updates the database schema to match the current state of your code.

### 3. Revert Migrations

Use this command to undo the last applied migration.

```bash
npm run migration:revert
```

Useful if you need to rollback a change during development or deployment.

## Best Practices

1.  **Never Modify Existing Migrations**: Once a migration has been committed and shared (or applied to production), do not edit it. Create a new migration to fix or change things.
2.  **Check Generated Code**: Always review the SQL generated in the migration file before running it to ensure it does what you expect.
3.  **One Change per Migration**: Try to keep migrations focused on a single feature or change set.
4.  **Sync `synchronize: false`**: We use `synchronize: false` in `app.module.ts` and `typeorm.config.ts` to ensure the schema is only modified via migrations, preventing accidental data loss.

## Recommended Workflow for New Features (Multiple Entities)

When creating multiple related entities (e.g., `Post`, `Tag`, `Category`, `Comment`), avoid generating a single massive migration. Instead, follow this **"Split by Table & Relations"** strategy to prevent circular dependency errors and ensure clean, debuggable migrations:

1.  **Comment out relations**: Temporarily comment out `@OneToMany`, `@ManyToOne`, and `@ManyToMany` decorators in your entities.
2.  **Generate Table Migrations**: Generate and run a migration for **each entity** individually.
    - `npm run migration:generate --name=CreateTags` -> `npm run migration:run`
    - `npm run migration:generate --name=CreatePosts` -> `npm run migration:run`
3.  **Restore Relations**: Uncomment the relation decorators in your entities.
4.  **Generate Relations Migration**: Generate a final migration that only adds the foreign keys and junction tables.
    - `npm run migration:generate --name=AddPostRelations` -> `npm run migration:run`

This approach ensures that tables exist before foreign keys reference them.