// In snapshots.repository.ts
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpotOrder } from '../../../common/entities/spot-order.entity';

@Injectable()
export class SpotOrderRepository {
  constructor(
    @InjectRepository(SpotOrder)
    private readonly repository: Repository<SpotOrder>,
  ) {}

  async findSnapshotByID(snapshot_id: string): Promise<SpotOrder[]> {
    return this.repository.find({ where: { snapshot_id } });
  }

  async createSnapshot(
    transactionData: Partial<SpotOrder>,
  ): Promise<SpotOrder> {
    const transaction = this.repository.create(transactionData);
    return this.repository.save(transaction);
  }
}
