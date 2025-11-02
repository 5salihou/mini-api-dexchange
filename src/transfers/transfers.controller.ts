import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('Transfers')
@Controller('transfers')
@UseGuards(ApiKeyGuard)
export class TransfersController {
  constructor(private readonly service: TransfersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Créer un transfert' })
  create(@Body() dto: CreateTransferDto) {
    return this.service.createTransfer(dto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Lister les transferts avec filtres et pagination' })
  findAll(@Query() filters: FilterTransferDto) {
    return this.service.findAllTransfers(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un transfert par ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOneTransfer(+id);
  }

  @Post(':id/process')
  @ApiOperation({ summary: 'Simuler le traitement d’un transfert' })
  process(@Param('id') id: string) {
    return this.service.transferProcess(+id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Annuler un transfert (seulement si PENDING)' })
  cancel(@Param('id') id: string) {
    return this.service.cancelTransfer(+id);
  }
}
