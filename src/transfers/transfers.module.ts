import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { ProviderSimulator } from './provider.simulator';

@Module({
  controllers: [TransfersController],
  providers: [TransfersService, ProviderSimulator],
  imports: [ConfigModule, PrismaModule, AuditModule],
})
export class TransfersModule {}
