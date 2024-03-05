import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WithdrawalService {
  private readonly logger = new Logger(WithdrawalService.name);

  constructor() {}

  async() {}
}
