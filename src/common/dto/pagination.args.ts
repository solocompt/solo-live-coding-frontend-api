import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Min, Max } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @ApiPropertyOptional({ default: 0, minimum: 0, description: 'Number of items to skip' })
  @Field(() => Int, { defaultValue: 0, description: 'Number of items to skip' })
  @IsOptional()
  @Min(0)
  skip: number = 0;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100, description: 'Number of items to take' })
  @Field(() => Int, { defaultValue: 10, description: 'Number of items to take (max 100)' })
  @IsOptional()
  @Min(1)
  @Max(100)
  take: number = 10;
}
