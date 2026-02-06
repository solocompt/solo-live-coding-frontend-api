import { Injectable } from '@nestjs/common';
import { TodosService } from '../../../todos/todos.service';
import { UsersService } from '../../../users/users.service';
import { User } from '../../../users/entities/user.entity';

@Injectable()
export class TodoSeeder {
  constructor(
    private readonly todosService: TodosService,
    private readonly usersService: UsersService,
  ) {}

  async seed() {
    console.log('Seeding todos...');
    
    // Get all users to assign todos
    // Note: Since we don't have a getAll in usersService that returns entities without pagination,
    // we'll fetch a page with a large limit to get most of them.
    const paginatedUsers = await this.usersService.findAll({ skip: 0, take: 100 });
    const users = paginatedUsers.items;

    if (users.length === 0) {
      console.warn('No users found. Skipping todo seeding.');
      return;
    }

    const tasks = [
      'Rever documentação do projeto',
      'Implementar autenticação JWT',
      'Criar testes unitários',
      'Configurar Docker Compose',
      'Fazer deploy no servidor de teste',
      'Corrigir bug na paginação',
      'Atualizar dependências do npm',
      'Refatorar código do módulo de usuários',
      'Escrever README.md',
      'Preparar apresentação para a equipa',
      'Agendar reunião de planeamento',
      'Validar inputs no formulário de registo',
      'Otimizar queries SQL',
      'Configurar CI/CD pipeline',
      'Revisar pull requests pendentes'
    ];

    // Create 5-10 todos for each user
    for (const user of users) {
      const todosCount = Math.floor(Math.random() * 6) + 5; // 5 to 10 todos
      
      console.log(`Creating ${todosCount} todos for user ${user.email}...`);

      for (let i = 0; i < todosCount; i++) {
        const taskContent = tasks[Math.floor(Math.random() * tasks.length)];
        const isCompleted = Math.random() > 0.7; // 30% chance of being completed
        const hasExpiration = Math.random() > 0.5; // 50% chance of having expiration
        
        let expiresAt: Date | undefined = undefined;
        if (hasExpiration) {
          const date = new Date();
          date.setDate(date.getDate() + Math.floor(Math.random() * 30)); // 0-30 days in future
          expiresAt = date;
        }

        await this.todosService.create({
          content: `${taskContent} (${i + 1})`,
          expiresAt,
        }, user);
      }
    }

    console.log('Todos seeding completed.');
  }
}
