import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @Field()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secretPass', description: 'User password (min 6 chars)' })
  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
