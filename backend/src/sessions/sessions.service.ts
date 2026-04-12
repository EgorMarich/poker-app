import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus } from './entities/session.entity';

export class CreateSessionDto {
  name: string;
  gameType?: any;
  smallBlind?: number;
  bigBlind?: number;
  buyIn?: number;
  venue?: string;
}

export class UpdateSessionDto {
  name?: string;
  cashOut?: number;
  status?: SessionStatus;
  generalNotes?: string;
  handNotes?: any[];
}

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async findAll(userId: string) {
    return this.sessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id, userId },
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async create(userId: string, dto: CreateSessionDto) {
    const session = this.sessionRepository.create({
      userId,
      ...dto,
      status: SessionStatus.ACTIVE,
      startedAt: new Date(),
    });
    return this.sessionRepository.save(session);
  }

  async update(id: string, userId: string, dto: UpdateSessionDto) {
    const session = await this.findOne(id, userId);

    if (dto.status === SessionStatus.COMPLETED && !session.endedAt) {
      session.endedAt = new Date();
    }

    Object.assign(session, dto);
    return this.sessionRepository.save(session);
  }

  async remove(id: string, userId: string) {
    const session = await this.findOne(id, userId);
    await this.sessionRepository.remove(session);
    return { message: 'Session deleted' };
  }

  async getStats(userId: string) {
    const sessions = await this.sessionRepository.find({
      where: { userId, status: SessionStatus.COMPLETED },
    });

    const totalSessions = sessions.length;
    const totalProfit = sessions.reduce(
      (sum, s) => sum + (Number(s.cashOut) - Number(s.buyIn)),
      0,
    );
    const totalBuyIn = sessions.reduce((sum, s) => sum + Number(s.buyIn), 0);
    const winRate = totalSessions > 0
      ? (sessions.filter((s) => Number(s.cashOut) > Number(s.buyIn)).length / totalSessions) * 100
      : 0;

    const totalDurationMs = sessions.reduce((sum, s) => {
      if (s.startedAt && s.endedAt) {
        return sum + (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime());
      }
      return sum;
    }, 0);

    const totalHours = totalDurationMs / 3600000;
    const hourlyRate = totalHours > 0 ? totalProfit / totalHours : 0;

    return {
      totalSessions,
      totalProfit: Math.round(totalProfit * 100) / 100,
      totalBuyIn: Math.round(totalBuyIn * 100) / 100,
      winRate: Math.round(winRate * 10) / 10,
      totalHours: Math.round(totalHours * 10) / 10,
      hourlyRate: Math.round(hourlyRate * 100) / 100,
      bestSession: sessions.sort(
        (a, b) => Number(b.cashOut) - Number(b.buyIn) - (Number(a.cashOut) - Number(a.buyIn)),
      )[0] ?? null,
    };
  }
}