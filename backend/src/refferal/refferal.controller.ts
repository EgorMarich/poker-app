import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '../users/entities/user.entity'
import { ReferralService } from './refferal.service'
import { JwtAuthGuard } from '@/guards/jwt-auth.guard'
import { CurrentUser } from '@/decorators/current-user.decorator'

@ApiTags('Referral')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get referral stats and promo code' })
  getStats(@CurrentUser() user: User) {
    return this.referralService.getStats(user.id)
  }
}