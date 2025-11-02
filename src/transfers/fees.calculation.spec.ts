import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ProviderSimulator } from './provider.simulator';

describe('TransfersService - Fees Calculation', () => {
  let service: TransfersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        {
          provide: PrismaService,
          useValue: {
            transfer: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: AuditService,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: ProviderSimulator,
          useValue: {
            processTransferWave: jest.fn(),
            processTransferOM: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
  });

  it('should calculate fees with min=100, max=1500 and 0.8%', () => {
    const amount = 100000;
    const fees = service['calculateFees'](amount);
    expect(fees).toBe(800); // 0.8% of 100000
    expect(amount + fees).toBe(100800);
  });

  it('should apply min fee = 100', () => {
    const amount = 2000;
    const fees = service['calculateFees'](amount);
    expect(fees).toBe(100);
  });

  it('should apply max fee = 1500', () => {
    const amount = 400000;
    const fees = service['calculateFees'](amount);
    expect(fees).toBe(1500);
  });
});
