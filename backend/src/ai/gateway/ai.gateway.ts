import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import OpenAI from 'openai';

import { Subscription } from '@/payments/entities/subscription.entity';
import { AiAdviceDto } from '../dto/ai.dto';
import { QueryLog, QueryStatus } from '../entities/query-log.entity';
import { extractErrorDetails } from '@/common/utils/error.utils';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'ai',
})
export class AiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(AiGateway.name);
  private openai: OpenAI;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(QueryLog)
    private queryLogRepository: Repository<QueryLog>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('stream-advice')
  async handleStreamAdvice(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: AiAdviceDto,
  ) {
    const userId = client.data.userId;
    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    // Check quota
    const subscription = await this.subscriptionRepository.findOne({
      where: { userId },
    });

    if (!subscription) {
      client.emit('error', { message: 'No subscription found' });
      return;
    }

    if (
      subscription.dailyAiQuota !== -1 &&
      subscription.dailyAiUsed >= subscription.dailyAiQuota
    ) {
      client.emit('quota-exceeded', {
        message: 'Daily quota exceeded',
        upgradeRequired: true,
      });
      return;
    }

    const log = this.queryLogRepository.create({
      userId,
      prompt: dto.prompt,
      context: dto.context,
      status: QueryStatus.SUCCESS,
    });

    try {
      client.emit('stream-start', { message: 'Generating advice...' });

      const stream = await this.openai.chat.completions.create({
        model: this.configService.get('OPENAI_MODEL', 'gpt-4o'),
        messages: [
          {
            role: 'system',
            content:
              'You are an expert poker coach. Give concise, actionable GTO advice.',
          },
          { role: 'user', content: dto.prompt },
        ],
        max_tokens: 600,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content ?? '';
        if (content) {
          fullResponse += content;
          client.emit('stream-chunk', { content });
        }
      }

      // Update quota
      subscription.dailyAiUsed += 1;
      subscription.monthlyAiUsed += 1;
      await this.subscriptionRepository.save(subscription);

      log.response = fullResponse;
      await this.queryLogRepository.save(log);

      client.emit('stream-end', {
        quotaRemaining: subscription.dailyAiQuota - subscription.dailyAiUsed,
      });
    } catch (error) {
      const errorDetails = extractErrorDetails(error);
      log.status = QueryStatus.ERROR;

      log.errorMessage = errorDetails.message;
      await this.queryLogRepository.save(log);
      client.emit('stream-error', { message: 'AI service error' });
    }
  }
}
