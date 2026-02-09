import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class RestPaginationArgs {
  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 20, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit: number = 20;
}
