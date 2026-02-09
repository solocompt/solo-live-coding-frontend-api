
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { IPaginatedType } from '../../common/dto/paginated.type';

export class PaginatedUser implements IPaginatedType<User> {
    @ApiProperty({ type: [User] })
    items: User[];
    
    @ApiProperty()
    total: number;
    
    @ApiProperty()
    hasNextPage: boolean;
}
