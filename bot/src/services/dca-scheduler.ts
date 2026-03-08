<<<<<<< HEAD
import { eq, lte, and, sql, gt, inArray } from 'drizzle-orm';
import { db, dcaSchedules, orders, watchedOrders, getUser } from './database';
import { createQuote, createOrder } from './sideshift-client';
import logger from './logger';

const RETRY_DELAY_MINUTES = 5;
const MAX_PROCESSING_TIME_MINUTES = 10;

=======
import { eq, lte, and } from 'drizzle-orm';
import { db, dcaSchedules, updateDCAScheduleExecution, getUser } from './database';
import { createQuote, createOrder } from './sideshift-client';
import logger from './logger';

>>>>>>> 941ae72
export class DCAScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
<<<<<<< HEAD
    this.intervalId = setInterval(() => this.processSchedules(), 60 * 1000);
=======
    this.intervalId = setInterval(() => this.processSchedules(), 60 * 1000); // Check every minute
>>>>>>> 941ae72
    logger.info('DCA Scheduler started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    logger.info('DCA Scheduler stopped');
  }

  async processSchedules() {
    try {
      const now = new Date();
<<<<<<< HEAD

      const dueSchedules = await db.transaction(async (tx) => {
        const schedules = await tx.select().from(dcaSchedules)
          .where(and(eq(dcaSchedules.isActive, 1), lte(dcaSchedules.nextExecutionAt, now)))
          .for('update', { skipLocked: true });

        if (schedules.length > 0) {
          const lockTime = new Date();
          lockTime.setMinutes(lockTime.getMinutes() + MAX_PROCESSING_TIME_MINUTES);

          const ids = schedules.map(s => s.id);
          await tx.update(dcaSchedules)
            .set({ nextExecutionAt: lockTime })
            .where(inArray(dcaSchedules.id, ids));
        }

        return schedules;
      });
=======
      // Find active schedules that are due (nextExecutionAt <= now)
      const dueSchedules = await db.select().from(dcaSchedules)
        .where(and(eq(dcaSchedules.isActive, 1), lte(dcaSchedules.nextExecutionAt, now)));
>>>>>>> 941ae72

      logger.info(`Checking DCA schedules: found ${dueSchedules.length} due.`);

      for (const schedule of dueSchedules) {
<<<<<<< HEAD
        this.executeSchedule(schedule).catch(error => {
          logger.error(`Failed to execute DCA ${schedule.id}`, error);
        });
      }
    } catch (e) {
      logger.error('Error in DCA loop', e);
    }
  }

  private async executeSchedule(schedule: any) {
    try {
      const user = await getUser(Number(schedule.telegramId));
      if (!user?.walletAddress) {
        logger.warn(`Skipping DCA ${schedule.id}: No wallet address`);
        await this.releaseLock(schedule.id, schedule.intervalHours);
        return;
      }

      const quote = await createQuote(
        schedule.fromAsset,
        schedule.fromNetwork,
        schedule.toAsset,
        schedule.toNetwork,
        parseFloat(schedule.amountPerOrder)
      );

      if (quote.error) {
        throw new Error(quote.error.message);
      }

      const order = await createOrder(quote.id, user.walletAddress, user.walletAddress);

      if (!order.id) {
        throw new Error('Failed to create order');
      }

      await db.transaction(async (tx) => {
        const depositAddr = typeof order.depositAddress === 'string'
          ? order.depositAddress
          : order.depositAddress?.address;
        const depositMemo = typeof order.depositAddress === 'object'
          ? order.depositAddress?.memo
          : null;

        await tx.insert(orders).values({
          telegramId: schedule.telegramId,
          sideshiftOrderId: order.id,
          quoteId: quote.id,
          fromAsset: schedule.fromAsset,
          fromNetwork: schedule.fromNetwork,
          fromAmount: schedule.amountPerOrder,
          toAsset: schedule.toAsset,
          toNetwork: schedule.toNetwork,
          settleAmount: quote.settleAmount.toString(),
          depositAddress: depositAddr!,
          depositMemo: depositMemo || null,
          status: 'pending'
        });

        await tx.insert(watchedOrders).values({
          telegramId: schedule.telegramId,
          sideshiftOrderId: order.id,
          lastStatus: 'pending',
        }).onConflictDoNothing();

        const nextExecution = this.calculateNextExecution(schedule.intervalHours);
        await tx.update(dcaSchedules)
          .set({
            ordersExecuted: sql`orders_executed + 1`,
            nextExecutionAt: nextExecution
          })
          .where(eq(dcaSchedules.id, schedule.id));
      });

      logger.info(`Executed DCA Schedule #${schedule.id}, Order: ${order.id}`);

    } catch (e) {
      logger.error(`Failed to execute DCA ${schedule.id}`, e);
      await this.scheduleRetry(schedule.id);
    }
  }


  private async releaseLock(scheduleId: number, intervalHours: number): Promise<void> {
    const nextExecution = this.calculateNextExecution(intervalHours);

    await db.update(dcaSchedules)
      .set({ nextExecutionAt: nextExecution })
      .where(eq(dcaSchedules.id, scheduleId));
  }

  private async scheduleRetry(scheduleId: number): Promise<void> {
    const retryTime = new Date();
    retryTime.setMinutes(retryTime.getMinutes() + RETRY_DELAY_MINUTES);

    await db.update(dcaSchedules)
      .set({ nextExecutionAt: retryTime })
      .where(eq(dcaSchedules.id, scheduleId));

    logger.info(`Scheduled retry for DCA ${scheduleId} at ${retryTime.toISOString()}`);
  }

  private calculateNextExecution(intervalHours: number): Date {
    const next = new Date();
    next.setHours(next.getHours() + intervalHours);
    return next;
=======
        try {
          let settleAddress = '';

          // Fetch user to get wallet address if needed
          if (schedule.telegramId) {
             const user = await getUser(Number(schedule.telegramId));
             if (user?.walletAddress) {
                 settleAddress = user.walletAddress;
             }
          }

          if (!settleAddress) {
              logger.warn(`Skipping DCA ${schedule.id}: No settle address found for user.`);
              continue;
          }

          // Execute Swap Logic
          // 1. Create Quote
          const quote = await createQuote(
              schedule.fromAsset, 
              schedule.fromNetwork, 
              schedule.toAsset, 
              schedule.toNetwork, 
              parseFloat(schedule.amountPerOrder)
          );

          // 2. Create Order
          // For DCA, we usually want an automated order, but SideShift needs user deposit. 
          // If this is a non-custodial bot, we likely generate a new deposit address and notify the user to pay? 
          // OR if it's automated (custodial or approved), we proceed. 
          // Assuming notification model:
          const order = await createOrder(quote.id, settleAddress, settleAddress); 

          // 3. Update Schedule
          await updateDCAScheduleExecution(schedule.id, this.getFrequency(schedule.intervalHours));

          logger.info(`Executed DCA Schedule #${schedule.id}, Order: ${order.id}`);

        } catch (e) {
          logger.error(`Failed to execute DCA ${schedule.id}`, e);
        }
      }
    } catch (e) {
       logger.error('Error in DCA loop', e);
    }
  }

  private getFrequency(hours: number): string {
      if (hours >= 720) return 'monthly';
      if (hours >= 168) return 'weekly';
      return 'daily';
>>>>>>> 941ae72
  }
}