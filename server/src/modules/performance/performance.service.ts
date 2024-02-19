// src/performance/performance.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Performance } from '../../common/entities/performance.entity';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
  ) {}

  async recordPerformance(data: Partial<Performance>): Promise<Performance> {
    const performance = this.performanceRepository.create(data);
    return this.performanceRepository.save(performance);
  }

  async getPerformanceByUserAndStrategy(userId: string, strategyType?: string): Promise<Performance[]> {
    const whereClause = strategyType ? { userId, strategyType } : { userId };
    return this.performanceRepository.find({ where: whereClause });
  }
}
