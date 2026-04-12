import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminService } from './admin.service';


import { UserRole } from '../users/entities/user.entity';
import { SubscriptionPlan } from '../payments/entities/subscription.entity';
import { Roles } from '@/decorators/roles.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

class SetRoleDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}

class SetPlanDto {
  @ApiProperty({ enum: SubscriptionPlan })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.getUsers(+page, +limit);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Set user role' })
  setRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetRoleDto,
  ) {
    return this.adminService.setUserRole(id, dto.role);
  }

  @Put('users/:id/active')
  @ApiOperation({ summary: 'Activate or deactivate user' })
  setActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.setUserActive(id, isActive);
  }

  @Put('users/:id/plan')
  @ApiOperation({ summary: 'Manually set user subscription plan' })
  setPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetPlanDto,
  ) {
    return this.adminService.manuallySetPlan(id, dto.plan);
  }
}