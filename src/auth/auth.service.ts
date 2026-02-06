import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { AuthResponse } from './dto/auth-response';
import { User } from '../users/entities/user.entity';
import { InvalidToken } from './entities/invalid-token.entity';

import { UpdateUserInput } from '../users/dto/update-user.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(InvalidToken)
    private invalidTokenRepository: Repository<InvalidToken>,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);
    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async logout(userId: string, token: string): Promise<boolean> {
    // Invalidate access token
    const invalidToken = this.invalidTokenRepository.create({ token });
    await this.invalidTokenRepository.save(invalidToken);

    // Clear refresh token from user
    await this.usersService.update(userId, { currentHashedRefreshToken: null });

    return true;
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    const invalidToken = await this.invalidTokenRepository.findOne({
      where: { token },
    });
    return !!invalidToken;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { currentHashedRefreshToken: hash });
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') ||
            'fallback_refresh_secret',
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.currentHashedRefreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    };
  }

  async updateProfile(
    userId: string,
    updateData: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(userId, updateData);
  }

  async deleteAccount(userId: string): Promise<User> {
    return this.usersService.remove(userId);
  }
}
