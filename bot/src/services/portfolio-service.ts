import { createQuote, createOrder } from './sideshift-client';
<<<<<<< HEAD
import { db, orders, watchedOrders } from './database';
import logger from './logger';
import type { ParsedCommand } from './parseUserCommand';
=======
import * as db from './database';
import logger from './logger';
>>>>>>> 941ae72

interface PortfolioExecutionResult {
  successfulOrders: Array<{
    order: any;
    allocation: any;
    quoteId: string;
    swapAmount: number;
  }>;
  failedSwaps: Array<{
    asset: string;
    reason: string;
  }>;
}

<<<<<<< HEAD
interface QuoteOrderPair {
  quote: any;
  order: any;
  allocation: any;
  swapAmount: number;
}

export async function executePortfolioStrategy(
  userId: number,
  parsedCommand: ParsedCommand
): Promise<PortfolioExecutionResult> {
  const { fromAsset, fromChain, amount, portfolio, settleAddress } = parsedCommand;

=======
export async function executePortfolioStrategy(
  userId: number,
  parsedCommand: any
): Promise<PortfolioExecutionResult> {
  const { fromAsset, fromChain, amount, portfolio, settleAddress } = parsedCommand;
  const successfulOrders: PortfolioExecutionResult['successfulOrders'] = [];
  const failedSwaps: PortfolioExecutionResult['failedSwaps'] = [];

  let remainingAmount = amount;

  // Validate Input (Basic checks, handler does UI checks)
>>>>>>> 941ae72
  if (!portfolio || portfolio.length === 0) {
    throw new Error('No portfolio allocation found');
  }

<<<<<<< HEAD
  const quotesAndOrders: QuoteOrderPair[] = [];
  let remainingAmount = amount!;

=======
>>>>>>> 941ae72
  for (let i = 0; i < portfolio.length; i++) {
    const allocation = portfolio[i];
    const isLast = i === portfolio.length - 1;

<<<<<<< HEAD
    let swapAmount = (amount! * allocation.percentage) / 100;

=======
    // Calculate split amount
    let swapAmount = (amount * allocation.percentage) / 100;

    // Handle rounding / remainder for last asset
>>>>>>> 941ae72
    if (isLast) {
      swapAmount = remainingAmount;
    } else {
      remainingAmount -= swapAmount;
    }

<<<<<<< HEAD
    if (swapAmount <= 0) {
      throw new Error(`Calculated amount too small for ${allocation.toAsset}`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const quote = await createQuote(
      fromAsset!,
      fromChain!,
      allocation.toAsset,
      allocation.toChain,
      swapAmount
    );

    if (quote.error) {
      throw new Error(`Quote failed for ${allocation.toAsset}: ${quote.error.message}`);
    }

    const order = await createOrder(quote.id!, settleAddress!, settleAddress!);

    if (!order.id) {
      throw new Error(`Order creation failed for ${allocation.toAsset}`);
    }

    quotesAndOrders.push({ quote, order, allocation, swapAmount });
  }

  await db.transaction(async (tx) => {
    for (const { quote, order, allocation, swapAmount } of quotesAndOrders) {
      const depositAddr = typeof order.depositAddress === 'string' 
        ? order.depositAddress 
        : order.depositAddress?.address;
      const depositMemo = typeof order.depositAddress === 'object' 
        ? order.depositAddress?.memo 
        : null;

      await tx.insert(orders).values({
        telegramId: userId,
        sideshiftOrderId: order.id,
        quoteId: quote.id!,
        fromAsset: fromAsset!,
        fromNetwork: fromChain!,
        fromAmount: swapAmount.toString(),
        toAsset: allocation.toAsset,
        toNetwork: allocation.toChain,
        settleAmount: quote.settleAmount.toString(),
        depositAddress: depositAddr!,
        depositMemo: depositMemo || null,
        status: 'pending'
      });

      await tx.insert(watchedOrders).values({
        telegramId: userId,
        sideshiftOrderId: order.id,
        lastStatus: 'pending',
      }).onConflictDoNothing();

=======
    // Ensure positive amount
    if (swapAmount <= 0) {
      failedSwaps.push({ asset: allocation.toAsset, reason: "Calculated amount too small" });
      continue;
    }

    try {
      // Rate limit delay (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create Quote
      const quote = await createQuote(
        fromAsset!,
        fromChain!,
        allocation.toAsset,
        allocation.toChain,
        swapAmount
      );

      if (quote.error) throw new Error(quote.error.message);

      // Execute Swap (Create Order)
      // Using settleAddress as refundAddress for simplicity
      const order = await createOrder(quote.id!, settleAddress!, settleAddress!);

      if (!order.id) throw new Error('Failed to create order ID');

      // Store Order in DB
      const orderCommand = {
        ...parsedCommand,
        toAsset: allocation.toAsset,
        toChain: allocation.toChain,
        amount: swapAmount
      };

      await db.createOrderEntry(userId, orderCommand, order, quote.settleAmount, quote.id!);
      await db.addWatchedOrder(userId, order.id, 'pending');

      successfulOrders.push({
        order,
        allocation,
        quoteId: quote.id!,
        swapAmount
      });

      // Log success
>>>>>>> 941ae72
      logger.info('Portfolio swap executed', {
        userId,
        asset: allocation.toAsset,
        amount: swapAmount,
        quoteId: quote.id,
        orderId: order.id
      });
<<<<<<< HEAD
    }
  });

  const successfulOrders = quotesAndOrders.map(({ quote, order, allocation, swapAmount }) => ({
    order,
    allocation,
    quoteId: quote.id!,
    swapAmount
  }));

  return { successfulOrders, failedSwaps: [] };
=======

    } catch (error) {
      // Handle partial failure
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      failedSwaps.push({ asset: allocation.toAsset, reason: errorMessage });

      logger.error('Portfolio swap failed', {
        userId,
        asset: allocation.toAsset,
        error: errorMessage
      });
    }
  }

  return { successfulOrders, failedSwaps };
>>>>>>> 941ae72
}
