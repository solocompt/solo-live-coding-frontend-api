import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface IPaginatedType<T> {
  items: T[];
  total: number;
  hasNextPage: boolean;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [classRef], { nullable: true, description: 'List of items' })
    items: T[];

    @Field(() => Int, { description: 'Total number of items' })
    total: number;

    @Field(() => Boolean, { description: 'Whether there is a next page' })
    hasNextPage: boolean;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
