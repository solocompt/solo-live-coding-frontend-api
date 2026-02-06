import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { UserSeeder } from './test/user.seeder';
import { TodoSeeder } from './test/todo.seeder';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  
  const seeders = {
    users: UserSeeder,
    todos: TodoSeeder,
  };

  const args = process.argv.slice(2);
  const seederName = args[0];

  try {
    if (seederName) {
      if (seeders[seederName]) {
        console.log(`Running seeder: ${seederName}`);
        const seeder = appContext.get(seeders[seederName]);
        await seeder.seed();
      } else {
        console.log(`Seeder '${seederName}' not found.`);
        console.log('Available seeders:', Object.keys(seeders).join(', '));
      }
    } else {
      console.log('Running all seeders...');
      for (const key of Object.keys(seeders)) {
        console.log(`Running seeder: ${key}`);
        const seeder = appContext.get(seeders[key]);
        await seeder.seed();
      }
    }
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
