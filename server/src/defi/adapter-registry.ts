import { Injectable } from '@nestjs/common';
import type { DexId } from './addresses';
import type { DexAdapter } from './adapters/dex-adapter';
import { UniswapV3Adapter } from './adapters/uniswapV3.adapter';
import { PancakeV3Adapter } from './adapters/pancakeV3.adapter';

@Injectable()
export class DexAdapterRegistry {
  private readonly adapters: Record<DexId, DexAdapter>;

  constructor(
    private readonly uniV3: UniswapV3Adapter,
    private readonly cakeV3: PancakeV3Adapter,
  ) {
    this.adapters = {
      uniswapV3: uniV3,
      pancakeV3: cakeV3,
    };
  }

  get(id: DexId): DexAdapter {
    const a = this.adapters[id];
    if (!a) throw new Error(`No adapter for id ${id}`);
    return a;
  }
}
