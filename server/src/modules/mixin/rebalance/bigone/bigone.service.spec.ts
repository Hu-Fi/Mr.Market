import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { BigoneService } from './bigone.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BigoneService', () => {
  let service: BigoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BigoneService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'rebalance.bigone_api_key') return 'test-api-key';
              if (key === 'rebalance.bigone_api_secret')
                return 'test-api-secret';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<BigoneService>(BigoneService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHeaders', () => {
    it('generate token', () => {
      service.getHeaders();
    });
  });

  describe('getWithdrawals', () => {
    it('should fetch withdrawals successfully', async () => {
      const mockResponse = { data: [{ id: 'withdrawal1' }] };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.getWithdrawals();
      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
      );
    });

    it('should throw an exception when the API call fails', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 404 } });

      await expect(service.getWithdrawals()).rejects.toThrow(
        'Failed to fetch withdrawals',
      );
    });
  });
});
