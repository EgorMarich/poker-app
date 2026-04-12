import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, AuthProvider } from '../users/entities/user.entity';
import {
  Subscription,
  SubscriptionPlan,
  PLAN_LIMITS,
} from '../payments/entities/subscription.entity';
import {
  TelegramAuthDto,
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from './dto/auth.dto';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── Telegram Auth (primary) ──────────────────────────────────────────────

  async telegramAuth(dto: TelegramAuthDto) {
    const telegramUser = this.validateTelegramInitData(dto.initData);

    // Find or create user
    let user = await this.userRepository.findOne({
      where: { telegramId: telegramUser.id },
      relations: ['subscription'],
    });

    if (!user) {
      user = await this.createTelegramUser(telegramUser);
    } else {
      // Update Telegram profile info (name/avatar may change)
      user = await this.updateTelegramProfile(user, telegramUser);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return {
      user: this.sanitizeUser(user),
      ...this.generateToken(user),
      isNewUser: !user.createdAt || 
        Date.now() - new Date(user.createdAt).getTime() < 5000,
    };
  }



  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.username ?? dto.email.split('@')[0],
      authProvider: AuthProvider.EMAIL,
    });

    await this.userRepository.save(user);
    await this.createFreeSubscription(user.id);

    const freshUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['subscription'],
    });

    return { user: this.sanitizeUser(freshUser), ...this.generateToken(freshUser) };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['subscription'],
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');
    if (!user.password) throw new UnauthorizedException('Use Telegram login for this account');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return { user: this.sanitizeUser(user), ...this.generateToken(user) };
  }

  // ─── Profile ──────────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscription'],
    });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!user.password) throw new UnauthorizedException('No password set — use Telegram login');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new UnauthorizedException('Current password is wrong');

    user.password = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, dto);
    await this.userRepository.save(user);
    return this.sanitizeUser(user);
  }


  private validateTelegramInitData(initData: string): TelegramUser {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');


    if (!botToken || botToken === 'dev') {
      return this.parseInitDataUnsafe(initData);
    }

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) throw new UnauthorizedException('Invalid Telegram data: no hash');

    params.delete('hash');
    const checkString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');


    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(checkString)
      .digest('hex');

    if (expectedHash !== hash) {
      throw new UnauthorizedException('Invalid Telegram data: hash mismatch');
    }

    const authDate = parseInt(params.get('auth_date') ?? '0');
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      throw new UnauthorizedException('Telegram data expired');
    }

    return this.parseInitDataUnsafe(initData);
  }

  private parseInitDataUnsafe(initData: string): TelegramUser {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    if (!userStr) throw new UnauthorizedException('No user data in initData');

    try {
      return JSON.parse(decodeURIComponent(userStr));
    } catch {
      throw new UnauthorizedException('Invalid user data format');
    }
  }

  private async createTelegramUser(tgUser: TelegramUser): Promise<User> {
    const user = this.userRepository.create({
      telegramId: tgUser.id,
      telegramUsername: tgUser.username,
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      telegramPhotoUrl: tgUser.photo_url,
      authProvider: AuthProvider.TELEGRAM,
    });

    await this.userRepository.save(user);
    await this.createFreeSubscription(user.id);

    return this.userRepository.findOne({
      where: { id: user.id },
      relations: ['subscription'],
    });
  }

  private async updateTelegramProfile(
    user: User,
    tgUser: TelegramUser,
  ): Promise<User> {
    user.telegramUsername = tgUser.username ?? user.telegramUsername;
    user.firstName = tgUser.first_name ?? user.firstName;
    user.lastName = tgUser.last_name ?? user.lastName;
    user.telegramPhotoUrl = tgUser.photo_url ?? user.telegramPhotoUrl;
    return this.userRepository.save(user);
  }

  private async createFreeSubscription(userId: string) {
    const limits = PLAN_LIMITS[SubscriptionPlan.FREE];
    const subscription = this.subscriptionRepository.create({
      userId,
      plan: SubscriptionPlan.FREE,
      maxRanges: limits.maxRanges,
      dailyAiQuota: limits.dailyAiQuota,
      monthlyAiQuota: limits.monthlyAiQuota,
      dailyResetAt: new Date(),
      monthlyResetAt: new Date(),
    });
    return this.subscriptionRepository.save(subscription);
  }

  

  private generateToken(user: User) {
    const payload = { sub: user.id, telegramId: user.telegramId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
    };
  }

  private sanitizeUser(user: User) {
    const { password, ...rest } = user as any;
    return rest;
  }
}
