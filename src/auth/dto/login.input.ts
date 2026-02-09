import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @Field()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 6 chars)' })
  @Field()
  @MinLength(6)
  password: string;
}
