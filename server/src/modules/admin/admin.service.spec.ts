import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { ConfigService } from '@nestjs/config';

describe('AdminService', () => {
  let service: AdminService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, ConfigService],
    }).compile();

    service = module.get<AdminService>(AdminService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true', async () => {
    const pass = config.get<string>('admin.pass');
    expect(await service.checkPass(pass)).toBe(true);
  });
});
