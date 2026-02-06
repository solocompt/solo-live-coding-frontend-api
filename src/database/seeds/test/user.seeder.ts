import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';

@Injectable()
export class UserSeeder {
  constructor(private readonly usersService: UsersService) {}

  async seed() {
    console.log('Seeding users...');
    
    // Create specific users for predictable testing
    const predefinedUsers = [
      { name: 'John Doe', email: 'john@example.com', password: 'Password123!' },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'Password123!' },
      { name: 'Admin User', email: 'admin@solo.com', password: 'Password123!' },
    ];

    for (const userData of predefinedUsers) {
      const exists = await this.usersService.findOneByEmail(userData.email);
      if (!exists) {
        await this.usersService.create(userData);
        console.log(`Created user: ${userData.email}`);
      } else {
        console.log(`User ${userData.email} already exists, skipping...`);
      }
    }

    // Create 10 random users
    for (let i = 1; i <= 10; i++) {
      const email = `user${i}@example.com`;
      const exists = await this.usersService.findOneByEmail(email);
      
      if (!exists) {
        await this.usersService.create({
          name: `User ${i}`,
          email,
          password: 'Password123!',
        });
        console.log(`Created generic user: ${email}`);
      }
    }

    console.log('Users seeding completed.');
  }
}
