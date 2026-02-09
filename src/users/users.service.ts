import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { PaginationArgs } from '../common/dto/pagination.args';
import { IPaginatedType } from '../common/dto/paginated.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    const user = this.usersRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findAll(paginationArgs: PaginationArgs): Promise<IPaginatedType<User>> {
    const [items, total] = await this.usersRepository.findAndCount({
      skip: paginationArgs.skip,
      take: paginationArgs.take,
    });

    return {
      items,
      total,
      hasNextPage: paginationArgs.skip + paginationArgs.take < total,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput & {
      currentHashedRefreshToken?: string | null;
    },
  ): Promise<User> {
    await this.findOne(id);

    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(
        updateUserInput.password,
        10,
      );
    }

    // Remove id from update data to avoid overwriting it (though it's the same)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...dataToUpdate } = updateUserInput;

    // TypeORM update with null needs special handling or just casting if compatible
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.usersRepository.update(id, dataToUpdate as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return user;
  }
}
