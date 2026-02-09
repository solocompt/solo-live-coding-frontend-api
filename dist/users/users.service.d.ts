import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginationArgs } from '../common/dto/pagination.args';
import { IPaginatedType } from '../common/dto/paginated.type';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserInput: CreateUserInput): Promise<User>;
    findAll(paginationArgs: PaginationArgs): Promise<IPaginatedType<User>>;
    findOne(id: string): Promise<User>;
    findOneByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserInput: UpdateUserInput & {
        currentHashedRefreshToken?: string | null;
    }): Promise<User>;
    remove(id: string): Promise<User>;
}
