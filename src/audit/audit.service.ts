import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(action: string, details: any) {
    await this.prisma.audit.create({
      data: {
        action,
        details: JSON.stringify(details),
        createdAt: new Date(),
      },
    });
  }
}
