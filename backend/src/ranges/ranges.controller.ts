import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RangesService } from './ranges.service';

import { CreateRangeDto, UpdateRangeDto } from './dto/ranges.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';

@ApiTags('Ranges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ranges')
export class RangesController {
  constructor(private rangesService: RangesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ranges for current user' })
  findAll(@CurrentUser() user: User) {
    console.log(user.id, 'в данный момент вот такой пользователь');
    return this.rangesService.findAll(user.id);
  }

  @Get('quota')
  @ApiOperation({ summary: 'Get ranges quota info for current user' })
  getQuota(@CurrentUser() user: User) {
    return this.rangesService.getQuotaInfo(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific range' })
  @ApiResponse({ status: 404, description: 'Range not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.rangesService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new range' })
  @ApiResponse({ status: 403, description: 'Range limit exceeded' })
  create(@CurrentUser() user: User, @Body() dto: CreateRangeDto) {
    return this.rangesService.create(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a range' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateRangeDto,
  ) {
    return this.rangesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a range' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.rangesService.remove(id, user.id);
  }
}
