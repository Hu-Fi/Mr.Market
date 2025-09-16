import * as ccxt from 'ccxt';
import { Injectable } from '@nestjs/common';

import { ExchangeInitService } from 'src/modules/exchangeInit/exchangeInit.service';
import { TradeService } from 'src/modules/trade/trade.service';
import { PerformanceService } from 'src/modules/performance/performance.service';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { IndicatorStrategyHistory } from 'src/common/entities/indicator-strategy-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeIndicatorStrategyDto } from './timeIndicator.dto';
import { Side } from 'src/common/constants/side';
import { SignalType } from 'src/common/enum/signaltype';

@Injectable()
export class TimeIndicatorStrategyService {
  private readonly logger = new CustomLogger(TimeIndicatorStrategyService.name);

  constructor(
    private readonly exchangeInit: ExchangeInitService,
    private readonly tradeService: TradeService,
    private readonly performanceService: PerformanceService,
    @InjectRepository(IndicatorStrategyHistory)
    private readonly historyRepo: Repository<IndicatorStrategyHistory>,
  ) {}

  /**
   * Run strategy once (stateless execution).
   * Decides whether to buy/sell based on selected indicators (EMA, RSI, or both).
   */
  async executeIndicatorStrategy(params: TimeIndicatorStrategyDto) {
    const { userId, clientId, exchangeName, symbol } = params;

    if (!this.isWithinTimeWindow(params)) {
      this.logger.debug(
        `[${exchangeName}:${symbol}] Outside time window — skipping.`,
      );
      return;
    }

    const ex = this.exchangeInit.getExchange(exchangeName);

    // Market data
    const ohlcv = await this.fetchCandles(
      ex,
      symbol,
      params.timeframe,
      params.lookback,
    );
    if (
      !ohlcv ||
      ohlcv.length < Math.max(params.emaSlow, params.rsiPeriod) + 2
    ) {
      this.logger.warn(`[${exchangeName}:${symbol}] Not enough candles yet.`);
      return;
    }

    // indicators
    const closes = ohlcv.map((c) => c[4]);
    const emaF = ema(closes, params.emaFast);
    const emaS = ema(closes, params.emaSlow);
    const rsiV = rsi(closes, params.rsiPeriod);

    const last = closes[closes.length - 1];
    const lastEmaF = emaF[emaF.length - 1];
    const lastEmaS = emaS[emaS.length - 1];
    const prevEmaF = emaF[emaF.length - 2];
    const prevEmaS = emaS[emaS.length - 2];
    const lastRsi = rsiV[rsiV.length - 1];

    const signal = calcCross(prevEmaF, prevEmaS, lastEmaF, lastEmaS);
    const rsiBuyOk =
      params.rsiBuyBelow === undefined || lastRsi <= params.rsiBuyBelow;
    const rsiSellOk =
      params.rsiSellAbove === undefined || lastRsi >= params.rsiSellAbove;

    let side: Side | null = null;

    if (params.indicatorMode === 'ema') {
      if (signal === SignalType.CROSS_UP) side = 'buy';
      else if (signal === SignalType.CROSS_DOWN) side = 'sell';
    } else if (params.indicatorMode === 'rsi') {
      if (rsiBuyOk) side = 'buy';
      else if (rsiSellOk) side = 'sell';
    } else if (params.indicatorMode === 'both') {
      if (signal === SignalType.CROSS_UP && rsiBuyOk) side = 'buy';
      else if (signal === SignalType.CROSS_DOWN && rsiSellOk) side = 'sell';
    }

    if (!side) {
      this.logger.debug(`[${exchangeName}:${symbol}] No trade signal.`);
      return;
    }

    const [base, quote] = symbol.split('/');
    const balances = await ex.fetchBalance();

    let amountBase: number;
    if (params.orderMode === 'base') {
      amountBase = params.orderSize;
    } else {
      amountBase = params.orderSize / last;
    }

    const freeBase = balances.free[base] ?? 0;
    const freeQuote = balances.free[quote] ?? 0;
    if (side === 'sell' && freeBase < amountBase * 1.01) {
      this.logger.warn(
        `[${exchangeName}:${symbol}] Insufficient ${base} to sell.`,
      );
      return;
    }
    if (side === 'buy' && freeQuote < amountBase * last * 1.01) {
      this.logger.warn(
        `[${exchangeName}:${symbol}] Insufficient ${quote} to buy.`,
      );
      return;
    }

    // min trade size
    const market = ex.markets[symbol];
    if (market?.limits?.amount?.min && amountBase < market.limits.amount.min) {
      this.logger.warn(
        `[${exchangeName}:${symbol}] Order amount ${amountBase} < min ${market.limits.amount.min}`,
      );
      return;
    }
    if (
      market?.limits?.cost?.min &&
      amountBase * last < market.limits.cost.min
    ) {
      this.logger.warn(
        `[${exchangeName}:${symbol}] Order cost ${amountBase * last} < min ${
          market.limits.cost.min
        }`,
      );
      return;
    }

    const bps = params.slippageBps ?? 10;
    const price =
      side === 'buy' ? last * (1 - bps / 10_000) : last * (1 + bps / 10_000);

    const adjAmount = parseFloat(ex.amountToPrecision(symbol, amountBase));
    const adjPrice = parseFloat(ex.priceToPrecision(symbol, price));

    const order = await this.tradeService.executeLimitTrade({
      userId,
      clientId,
      exchange: ex.id,
      symbol,
      side,
      amount: adjAmount,
      price: adjPrice,
    });

    await this.historyRepo.save(
      this.historyRepo.create({
        userId,
        clientId,
        exchange: ex.id,
        symbol,
        side,
        amount: adjAmount,
        price: adjPrice,
        orderId: order?.id,
      }),
    );

    await this.performanceService.recordPerformance({
      userId,
      clientId,
      strategyType: 'timeIndicator',
      profitLoss: 0,
      additionalMetrics: {
        side,
        last,
        price: adjPrice,
        emaFast: lastEmaF,
        emaSlow: lastEmaS,
        rsi: lastRsi,
        signal,
      },
      executedAt: new Date(),
    });

    this.logger.log(
      `[${exchangeName}:${symbol}] ${side.toUpperCase()} ${adjAmount} @ ${adjPrice} (EMA${
        params.emaFast
      }/${params.emaSlow}, RSI=${lastRsi.toFixed(2)})`,
    );
  }

  private isWithinTimeWindow(params: TimeIndicatorStrategyDto) {
    const now = new Date();
    const wd = now.getDay();
    const hr = now.getHours();

    if (params.allowedWeekdays?.length && !params.allowedWeekdays.includes(wd))
      return false;
    if (params.allowedHours?.length && !params.allowedHours.includes(hr))
      return false;
    return true;
  }

  private async fetchCandles(
    ex: ccxt.Exchange,
    symbol: string,
    timeframe: string,
    lookback: number,
  ) {
    try {
      const limit = Math.max(lookback, 200);
      return await ex.fetchOHLCV(symbol, timeframe, undefined, limit);
    } catch (e: any) {
      this.logger.error(
        `fetchOHLCV error on ${ex.id} ${symbol} ${timeframe}: ${e.message}`,
      );
      return [];
    }
  }
}
// Indicator funcs
function ema(series: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const out: number[] = [];
  let prev: number | undefined = undefined;
  series.forEach((v, i) => {
    if (i === 0) {
      prev = v;
      out.push(v);
    } else {
      const e = (v - (prev as number)) * k + (prev as number);
      out.push(e);
      prev = e;
    }
  });
  return out;
}

function rsi(series: number[], period: number): number[] {
  if (series.length < period + 1) return new Array(series.length).fill(NaN);
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const ch = series[i] - series[i - 1];
    gains.push(Math.max(0, ch));
    losses.push(Math.max(0, -ch));
  }
  let avgGain = avg(gains.slice(0, period));
  let avgLoss = avg(losses.slice(0, period));

  const rsiArr = new Array(period).fill(NaN);
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const val = 100 - 100 / (1 + rs);
    rsiArr.push(val);
  }
  rsiArr.unshift(NaN);
  return rsiArr;
}

function avg(arr: number[]) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calcCross(
  prevFast: number,
  prevSlow: number,
  fast: number,
  slow: number,
): SignalType {
  const wasBelow = prevFast <= prevSlow;
  const nowAbove = fast > slow;
  const wasAbove = prevFast >= prevSlow;
  const nowBelow = fast < slow;
  if (wasBelow && nowAbove) return SignalType.CROSS_UP;
  if (wasAbove && nowBelow) return SignalType.CROSS_DOWN;
  return SignalType.NONE;
}
