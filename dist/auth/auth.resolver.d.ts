import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { User } from '../users/entities/user.entity';
import { UpdateUserInput } from '../users/dto/update-user.input';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginInput: LoginInput): Promise<AuthResponse>;
    signup(signupInput: SignupInput): Promise<AuthResponse>;
    logout(context: {
        req: Request;
    }, user: User): Promise<boolean>;
    refreshTokens(user: User & {
        refreshToken: string;
    }): Promise<AuthResponse>;
    updateProfile(user: User, updateUserInput: UpdateUserInput): Promise<User>;
    deleteAccount(user: User): Promise<User>;
    me(user: User): User;
}
