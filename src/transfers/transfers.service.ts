import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
import { AuditService } from '../audit/audit.service';
import { ProviderSimulator } from './provider.simulator';
import { TransferStatus } from '@prisma/client';
@Injectable()
export class TransfersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private provider: ProviderSimulator,
  ) {}

  private calculateFees(amount: number): number {
    const fee = Math.ceil(amount * 0.008);
    return Math.min(Math.max(fee, 100), 1500);
  }

  async createTransfer(dto: CreateTransferDto) {
    const fees = this.calculateFees(dto.amount);
    const ref = `TRF-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 9999)}`;

    const transfer = await this.prisma.transfer.create({
      data: {
        ...dto,
        ref,
        fees,
        total: dto.amount + fees,
        status: TransferStatus.PENDING,
        recipient: JSON.parse(JSON.stringify(dto.recipient)),
      },
    });

    await this.audit.log('TRANSFER_CREATED', transfer);
    return transfer;
  }

  async findAllTransfers(filters: FilterTransferDto) {
    const {
      status,
      channel,
      minAmount,
      maxAmount,
      q,
      limit = 10,
      cursor,
    } = filters;

    const where: any = {};
    if (status) where.status = status;
    if (channel) where.channel = channel;
    if (minAmount || maxAmount)
      where.amount = { gte: minAmount, lte: maxAmount };
    if (q)
      where.OR = [
        { reference: { contains: q } },
        { 'recipient.name': { contains: q } },
      ];

    const items = await this.prisma.transfer.findMany({
      where,
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    const nextCursor = items.length ? items[items.length - 1].id : null;

    return { items, nextCursor };
  }

  async findOneTransfer(id: number) {
    const transfer = await this.prisma.transfer.findUnique({ where: { id } });
    if (!transfer) throw new NotFoundException();
    return transfer;
  }

  async transferProcess(id: number) {
    const transfer = await this.findOneTransfer(id);
    if (['SUCCESS', 'FAILED', 'CANCELED'].includes(transfer.status))
      throw new ConflictException('Transfer already finalized');

    await this.prisma.transfer.update({
      where: { id },
      data: { status: 'PROCESSING' as TransferStatus },
    });
    await this.audit.log('TRANSFER_PROCESSING', { id });

    const result =
      transfer.channel === 'WAVE'
        ? await this.provider.processTransferWave()
        : await this.provider.processTransferOM();

    const updated = await this.prisma.transfer.update({
      where: { id },
      data:
        result.status === 'SUCCESS'
          ? {
              status: 'SUCCESS' as TransferStatus,
              providerRef: result.provider_ref,
            }
          : {
              status: 'FAILED' as TransferStatus,
              errorCode: result.error_code,
            },
    });

    await this.audit.log(`TRANSFER_${result.status}`, updated);
    return updated;
  }

  async cancelTransfer(id: number) {
    const transfer = await this.findOneTransfer(id);
    if (transfer.status !== 'PENDING')
      throw new ConflictException('Only PENDING transfers can be canceled');

    const updated = await this.prisma.transfer.update({
      where: { id },
      data: { status: 'CANCELED' as TransferStatus },
    });

    await this.audit.log('TRANSFER_CANCELED', updated);
    return updated;
  }
}
