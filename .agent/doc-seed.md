# Database Seeding Documentation

This project uses a custom seeding system integrated with NestJS dependency injection. This allows us to use our existing services (like `AuthService`) to populate the database, ensuring that all business logic (hashing passwords, validations, etc.) is respected.

## Overview

- **Seed Runner**: `src/database/seeds/seed.ts`
- **Seeder Module**: `src/database/seeds/seeder.module.ts`
- **Test/Dev Seeders**: `src/database/seeds/test/*.seeder.ts`
- **Production Seeders**: (Future seeders can be placed in `src/database/seeds/prod/`)

## Commands

All commands are run from the `backend` directory.

### 1. Run All Seeders

To run all registered seeders:

```bash
npm run seed
```

### 2. Run a Specific Seeder

To run a specific seeder by name (e.g., `users`):

```bash
npm run seed -- users
```

### 3. List Available Seeders

If you provide an invalid name, the script will list available seeders:

```bash
npm run seed -- help
```

## How to Create a New Seeder

### 1. Create the Seeder Service

Create a new file (e.g., `product.seeder.ts`) in `src/database/seeds/test/` (or appropriate folder).

```typescript
import { Injectable } from "@nestjs/common";
import { ProductService } from "../../../products/products.service"; // Example import

@Injectable()
export class ProductSeeder {
  constructor(private readonly productService: ProductService) {}

  async seed() {
    // Your seeding logic here
    await this.productService.create({ name: "Product 1", price: 100 });
    console.log("Products seeded");
  }
}
```

### 2. Register in SeederModule

Add your new seeder to the `providers` array in `src/database/seeds/seeder.module.ts`.

```typescript
// src/database/seeds/seeder.module.ts
import { ProductSeeder } from "./test/product.seeder";

@Module({
  imports: [AppModule, ProductsModule], // Import module containing the service you need
  providers: [UserSeeder, ProductSeeder], // Add here
})
export class SeederModule {}
```

### 3. Register in Seed Runner

Update the `seeders` map in `src/database/seeds/seed.ts`.

```typescript
// src/database/seeds/seed.ts
import { ProductSeeder } from "./test/product.seeder";

// ...

const seeders = {
  users: UserSeeder,
  products: ProductSeeder, // Add here
};
```

## Best Practices

1.  **Idempotency**: Seeders should be safe to run multiple times. Check if data exists before creating it (e.g., `User already exists, skipping...`).
2.  **Use Services**: Always inject services (`AuthService`, `UsersService`) instead of using Repositories directly. This ensures data consistency and validation.
3.  **Separate Environments**: Keep test/development seeders (like dummy users) separate from production seeders (like initial admin accounts or static lookup data).