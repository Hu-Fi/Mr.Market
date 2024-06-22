/**
 * PerformanceService
 *
 * This service handles operations related to recording and retrieving performance metrics for users and strategies.
 *
 * Dependencies:
 * - InjectRepository: Injects the repository for the Performance entity.
 * - Repository: TypeORM repository for managing database operations.
 * - Performance: Entity representing performance metrics.
 *
 * Methods:
 *
 * - constructor: Initializes the service with the injected Performance repository.
 *
 * - recordPerformance(data: Partial<Performance>): Creates and saves a new performance record in the database.
 *
 * - getPerformanceByUserAndStrategy(userId: string, strategyType?: string): Retrieves performance records by user ID and optional strategy type.
 *
 * Notes:
 * - The service uses TypeORM for database interactions.
 * - The recordPerformance method creates a new performance record and saves it to the database.
 * - The getPerformanceByUserAndStrategy method retrieves performance records based on user ID and an optional strategy type filter.
 * - The service ensures that performance data is correctly recorded and retrieved from the database.
 */

import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from 'src/common/entities/performance.entity';

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

  async getPerformanceByUserAndStrategy(
    userId: string,
    strategyType?: string,
  ): Promise<Performance[]> {
    const whereClause = strategyType ? { userId, strategyType } : { userId };
    return this.performanceRepository.find({ where: whereClause });
  }
}
