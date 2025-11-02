import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TransfersModule } from './transfers/transfers.module';
import { AuditModule } from './audit/audit.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Permet d'accéder à la config partout dans l'application
    }),
    PrismaModule,
    TransfersModule,
    AuditModule,
  ],
})
export class AppModule {}
