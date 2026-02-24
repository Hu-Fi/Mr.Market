import * as ccxt from 'ccxt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExchangeInitService } from 'src/modules/exchangeInit/exchangeInit.service';
import { TradeService } from 'src/modules/trade/trade.service';
import { PerformanceService } from 'src/modules/performance/performance.service';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { IndicatorStrategyHistory } from 'src/common/entities/indicator-strategy-history.entity';
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
    if (!ex) {
      this.logger.error(`Exchange '${exchangeName}' is not initialized.`);
      return;
    }

    try {
      if (!ex.markets || Object.keys(ex.markets).length === 0) {
        await ex.loadMarkets();
      }
    } catch (e: any) {
      this.logger.error(`[${exchangeName}] loadMarkets failed: ${e.message}`);
      return;
    }

    if (!ex.markets[symbol]) {
      this.logger.error(`[${exchangeName}] Unknown symbol '${symbol}'.`);
      return;
    }

    if (ex.timeframes && !ex.timeframes[params.timeframe]) {
      this.logger.error(
        `[${exchangeName}:${symbol}] Unsupported timeframe '${params.timeframe}'.`,
      );
      return;
    }

    if (params.maxConcurrentPositions && params.maxConcurrentPositions > 0) {
      try {
        const openOrders = await ex.fetchOpenOrders(symbol);
        if (openOrders.length >= params.maxConcurrentPositions) {
          this.logger.warn(
            `[${exchangeName}:${symbol}] Open orders (${openOrders.length}) >= maxConcurrentPositions (${params.maxConcurrentPositions}). Skipping.`,
          );
          return;
        }
      } catch (e: any) {
        this.logger.warn(
          `[${exchangeName}:${symbol}] fetchOpenOrders failed (${e.message}). Proceeding anyway.`,
        );
      }
    }

    // --- Market data ---
    const ohlcv = await this.fetchCandles(
      ex,
      symbol,
      params.timeframe,
      params.lookback,
    );
    const minBarsNeeded = Math.max(params.emaSlow, params.rsiPeriod) + 2;
    if (!ohlcv || ohlcv.length < minBarsNeeded) {
      this.logger.warn(`[${exchangeName}:${symbol}] Not enough candles yet.`);
      return;
    }

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

    if (
      [lastEmaF, lastEmaS, prevEmaF, prevEmaS, lastRsi].some(
        (x) => x === undefined || Number.isNaN(x),
      )
    ) {
      this.logger.debug(
        `[${exchangeName}:${symbol}] Indicators not ready (NaN).`,
      );
      return;
    }

    const signal = calcCross(prevEmaF, prevEmaS, lastEmaF, lastEmaS);
    const rsiBuyOk =
      params.rsiBuyBelow === undefined || lastRsi <= params.rsiBuyBelow!;
    const rsiSellOk =
      params.rsiSellAbove === undefined || lastRsi >= params.rsiSellAbove!;

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

    // --- Balance & sizing ---
    const [base, quote] = symbol.split('/');
    let balances;
    try {
      balances = await ex.fetchBalance();
    } catch (e: any) {
      this.logger.error(`[${exchangeName}] fetchBalance failed: ${e.message}`);
      return;
    }

    const amountBaseRaw =
      params.orderMode === 'base' ? params.orderSize : params.orderSize / last;

    const freeBase = balances.free?.[base] ?? 0;
    const freeQuote = balances.free?.[quote] ?? 0;

    if (side === 'sell' && freeBase < amountBaseRaw * 1.01) {
      this.logger.warn(
        `[${exchangeName}:${symbol}] Insufficient ${base} to sell.`,
      );
      return;
    }
    if (side === 'buy' && freeQuote < amountBaseRaw * last * 1.01) {
      this.logger.warn(
        `[${exchangeName}:${symbol}] Insufficient ${quote} to buy.`,
      );
      return;
    }

    const market = ex.markets[symbol];
    const amountPrec = (x: number) =>
      parseFloat(ex.amountToPrecision(symbol, x));
    const pricePrec = (x: number) => parseFloat(ex.priceToPrecision(symbol, x));

    let amountBase = amountPrec(amountBaseRaw);
    if (market?.limits?.amount?.min && amountBase < market.limits.amount.min) {
      amountBase = amountPrec(market.limits.amount.min);
    }
    if (
      market?.limits?.cost?.min &&
      amountBase * last < market.limits.cost.min
    ) {
      const needed = market.limits.cost.min / last;
      amountBase = amountPrec(Math.max(amountBase, needed));
    }

    const bps = params.slippageBps ?? 10;
    const entryPriceRaw =
      side === 'buy' ? last * (1 - bps / 10_000) : last * (1 + bps / 10_000);
    const entryPrice = pricePrec(entryPriceRaw);

    // --- Entry ---
    let order: any | undefined;
    try {
      order = await this.tradeService.executeLimitTrade({
        userId,
        clientId,
        exchange: ex.id,
        symbol,
        side,
        amount: amountBase,
        price: entryPrice,
      });
    } catch (e: any) {
      this.logger.error(
        `[${exchangeName}:${symbol}] Entry order failed: ${e.message}`,
      );
      return;
    }

    await this.historyRepo.save(
      this.historyRepo.create({
        userId,
        clientId,
        exchange: ex.id,
        symbol,
        side,
        amount: amountBase,
        price: entryPrice,
        orderId: order?.id,
      }),
    );

    // --- Exits ---
    const slPct = safePct(params.stopLossPct);
    const tpPct = safePct(params.takeProfitPct);
    if (slPct || tpPct) {
      try {
        await this.placeProtectiveExits({
          ex,
          symbol,
          entrySide: side,
          entryPrice,
          amountBase,
          stopLossPct: slPct,
          takeProfitPct: tpPct,
        });
      } catch (e: any) {
        this.logger.warn(
          `[${exchangeName}:${symbol}] Could not place exits: ${e.message}.`,
        );
      }
    }

    // --- Performance ---
    await this.performanceService.recordPerformance({
      userId,
      clientId,
      strategyType: 'timeIndicator',
      profitLoss: 0,
      additionalMetrics: {
        side,
        last,
        entryPrice,
        emaFast: lastEmaF,
        emaSlow: lastEmaS,
        rsi: lastRsi,
        signal,
        stopLossPct: slPct,
        takeProfitPct: tpPct,
      },
      executedAt: new Date(),
    });

    this.logger.log(
      `[${exchangeName}:${symbol}] ${side.toUpperCase()} ${amountBase} @ ${entryPrice} (EMA${
        params.emaFast
      }/${params.emaSlow}, RSI=${lastRsi.toFixed(2)}${
        slPct ? `, SL=${slPct}%` : ''
      }${tpPct ? `, TP=${tpPct}%` : ''})`,
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

  private async placeProtectiveExits(opts: {
    ex: ccxt.Exchange;
    symbol: string;
    entrySide: Side;
    entryPrice: number;
    amountBase: number;
    stopLossPct?: number;
    takeProfitPct?: number;
  }) {
    const {
      ex,
      symbol,
      entrySide,
      entryPrice,
      amountBase,
      stopLossPct,
      takeProfitPct,
    } = opts;

    const exitSide: Side = entrySide === 'buy' ? 'sell' : 'buy';
    const pricePrec = (x: number) => parseFloat(ex.priceToPrecision(symbol, x));
    const amountPrec = (x: number) =>
      parseFloat(ex.amountToPrecision(symbol, x));
    const amount = amountPrec(amountBase);

    let slTrigger: number | undefined;
    let tpLimit: number | undefined;

    if (stopLossPct && stopLossPct > 0) {
      slTrigger =
        entrySide === 'buy'
          ? pricePrec(entryPrice * (1 - stopLossPct / 100))
          : pricePrec(entryPrice * (1 + stopLossPct / 100));
    }

    if (takeProfitPct && takeProfitPct > 0) {
      tpLimit =
        entrySide === 'buy'
          ? pricePrec(entryPrice * (1 + takeProfitPct / 100))
          : pricePrec(entryPrice * (1 - takeProfitPct / 100));
    }

    if (tpLimit) {
      try {
        await ex.createOrder(symbol, 'limit', exitSide, amount, tpLimit);
        this.logger.debug(
          `[${ex.id}:${symbol}] TP placed: ${exitSide} ${amount} @ ${tpLimit}`,
        );
      } catch (e: any) {
        this.logger.warn(
          `[${ex.id}:${symbol}] TP placement failed: ${e.message}`,
        );
      }
    }

    if (slTrigger) {
      try {
        await ex.createOrder(symbol, 'market', exitSide, amount, undefined, {
          stopPrice: slTrigger,
        });
        this.logger.debug(
          `[${ex.id}:${symbol}] SL placed: ${exitSide} ${amount} stopPrice=${slTrigger}`,
        );
      } catch (e: any) {
        this.logger.warn(
          `[${ex.id}:${symbol}] SL placement failed: ${e.message}`,
        );
      }
    }
  }
}

// --- Indicator functions ---
function ema(series: number[], period: number): number[] {
  if (period <= 0) return series.map(() => NaN);
  const k = 2 / (period + 1);
  const out: number[] = [];
  let prev: number | undefined;
  for (let i = 0; i < series.length; i++) {
    const v = series[i];
    if (i === 0 || prev === undefined) {
      prev = v;
      out.push(v);
    } else {
      const e = (v - prev) * k + prev;
      out.push(e);
      prev = e;
    }
  }
  return out;
}

function rsi(series: number[], period: number): number[] {
  if (period <= 0 || series.length < period + 1)
    return new Array(series.length).fill(NaN);
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const ch = series[i] - series[i - 1];
    gains.push(ch > 0 ? ch : 0);
    losses.push(ch < 0 ? -ch : 0);
  }
  let avgGain = avg(gains.slice(0, period));
  let avgLoss = avg(losses.slice(0, period));
  const rsiArr = new Array(series.length).fill(NaN);
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    const rs = avgLoss === 0 ? Number.POSITIVE_INFINITY : avgGain / avgLoss;
    const val = 100 - 100 / (1 + rs);
    rsiArr[i + 1] = val;
  }
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

function safePct(v?: number) {
  if (v === undefined || v === null) return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return n;
}
