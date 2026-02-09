import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { AuthResponse } from './dto/auth-response';
import { User } from '../users/entities/user.entity';
import { InvalidToken } from './entities/invalid-token.entity';
import { UpdateUserInput } from '../users/dto/update-user.input';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private invalidTokenRepository;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, invalidTokenRepository: Repository<InvalidToken>);
    validateUser(email: string, pass: string): Promise<User | null>;
    login(loginInput: LoginInput): Promise<AuthResponse>;
    signup(signupInput: SignupInput): Promise<AuthResponse>;
    logout(userId: string, token: string): Promise<boolean>;
    isTokenInvalid(token: string): Promise<boolean>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    getTokens(userId: string, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<AuthResponse>;
    updateProfile(userId: string, updateData: UpdateUserInput): Promise<User>;
    deleteAccount(userId: string): Promise<User>;
}
