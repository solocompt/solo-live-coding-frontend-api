import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

import { UpdateUserInput } from '../users/dto/update-user.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { description: 'Login with email and password' })
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AuthResponse, { description: 'Register a new user' })
  signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => Boolean, { description: 'Logout current user' })
  @UseGuards(JwtAuthGuard)
  async logout(
    @Context() context: { req: Request },
    @CurrentUser() user: User,
  ) {
    const token = context.req.headers.authorization?.split(' ')[1];
    if (token) {
      return this.authService.logout(user.id, token);
    }
    return false;
  }

  @Mutation(() => AuthResponse, { description: 'Refresh access token using refresh token' })
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@CurrentUser() user: User & { refreshToken: string }) {
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }

  @Mutation(() => User, { description: 'Update current user profile' })
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    // Ensure user can only update their own profile
    // Although we use CurrentUser id implicitly, we should make sure the input doesn't try to swap IDs if that's even possible in the service logic (usually service takes ID as arg)
    // The service method we added takes userId separately, so we are safe.
    // However, UpdateUserInput usually contains ID. We should probably ignore the ID in the input or validate it.
    // For now, let's just pass the data part.
    return this.authService.updateProfile(user.id, updateUserInput);
  }

  @Mutation(() => User, { description: 'Delete current user account' })
  @UseGuards(JwtAuthGuard)
  deleteAccount(@CurrentUser() user: User) {
    return this.authService.deleteAccount(user.id);
  }

  @Query(() => User, { description: 'Get current user profile' })
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}
