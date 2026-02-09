import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PaginationArgs } from '../common/dto/pagination.args';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(paginationArgs: PaginationArgs): Promise<import("../common/dto/paginated.type").IPaginatedType<User>>;
    findOne(id: string): Promise<User>;
}
