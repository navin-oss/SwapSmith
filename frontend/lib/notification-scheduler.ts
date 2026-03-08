import cron from 'node-cron';
import { sendPriceAlertEmail, sendWalletReminderEmail } from '@/lib/email';
<<<<<<< HEAD
import { getActivePriceAlerts, getCachedPrice } from '@/lib/database';
import logger from '@/lib/logger';
=======
>>>>>>> 941ae72

// Store active cron jobs
const scheduledJobs: Map<string, ReturnType<typeof cron.schedule>> = new Map();

export interface NotificationSchedule {
  userId: string;
  userEmail: string;
  userName: string;
  type: 'wallet' | 'price' | 'general';
  frequency: 'daily' | 'weekly' | 'custom';
  cronExpression?: string;
}

// Helper to get cron expression based on frequency
function getCronExpression(frequency: string, customCron?: string): string {
  switch (frequency) {
    case 'daily':
      return '0 9 * * *'; // 9 AM daily
    case 'weekly':
      return '0 9 * * 1'; // 9 AM every Monday
    case 'custom':
      return customCron || '0 9 * * *';
    default:
      return '0 9 * * *';
  }
}

// Schedule a notification
export function scheduleNotification(schedule: NotificationSchedule) {
  const jobKey = `${schedule.userId}-${schedule.type}`;
  
  // Stop existing job if any
  if (scheduledJobs.has(jobKey)) {
    scheduledJobs.get(jobKey)?.stop();
  }

  const cronExpression = getCronExpression(schedule.frequency, schedule.cronExpression);
  
  const job = cron.schedule(cronExpression, async () => {
<<<<<<< HEAD
    logger.info('Running scheduled notification', { userEmail: schedule.userEmail });
=======
    console.log(`Running scheduled notification for ${schedule.userEmail}`);
>>>>>>> 941ae72
    
    try {
      switch (schedule.type) {
        case 'wallet':
          await sendWalletReminderEmail(schedule.userEmail, schedule.userName);
          break;
        
        case 'price':
<<<<<<< HEAD
          // Fetch user's active price alerts
          const alerts = await getActivePriceAlerts(schedule.userId);
          
          if (alerts.length === 0) {
            logger.info('No active price alerts for user', { userId: schedule.userId });
            break;
          }
          
          // Check each alert and send notification if triggered
          for (const alert of alerts) {
            try {
              const priceData = await getCachedPrice(alert.coin, alert.network);
              
              if (!priceData || !priceData.usdPrice) {
                logger.warn('No price data available for alert', {
                  coin: alert.coin,
                  network: alert.network
                });
                continue;
              }
              
              const currentPrice = parseFloat(priceData.usdPrice);
              const targetPrice = parseFloat(alert.targetPrice as string);
              
              // Calculate price change
              const priceChange = ((currentPrice - targetPrice) / targetPrice * 100).toFixed(2);
              const priceChangeStr = priceChange.startsWith('-') ? priceChange : `+${priceChange}`;
              
              // Send email with real price data
              await sendPriceAlertEmail(
                schedule.userEmail,
                schedule.userName,
                alert.name,
                currentPrice.toFixed(2),
                `${priceChangeStr}%`
              );
              
              logger.info('Sent price alert email', {
                userId: schedule.userId,
                coin: alert.name,
                currentPrice,
                targetPrice
              });
              
            } catch (error) {
              logger.error('Error processing price alert', {
                alertId: alert.id,
                error: error instanceof Error ? error.message : String(error)
              });
            }
          }
          break;
      }
    } catch (error) {
      logger.error('Error sending scheduled notification', { 
        error: error instanceof Error ? error.message : String(error) 
      });
=======
          // Fetch latest crypto prices and send alert
          // This would integrate with your price API
          const mockPrice = '45,231.50';
          const mockChange = '+2.34';
          await sendPriceAlertEmail(
            schedule.userEmail,
            schedule.userName,
            'Bitcoin',
            mockPrice,
            mockChange
          );
          break;
      }
    } catch (error) {
      console.error('Error sending scheduled notification:', error);
>>>>>>> 941ae72
    }
  });

  scheduledJobs.set(jobKey, job);
<<<<<<< HEAD
  logger.info('Scheduled notification', { 
    type: schedule.type, 
    userEmail: schedule.userEmail, 
    cronExpression 
  });
=======
  console.log(`Scheduled ${schedule.type} notification for ${schedule.userEmail} with cron: ${cronExpression}`);
>>>>>>> 941ae72
  
  return { success: true, jobKey, cronExpression };
}

// Stop a scheduled notification
export function stopScheduledNotification(userId: string, type: string) {
  const jobKey = `${userId}-${type}`;
  
  if (scheduledJobs.has(jobKey)) {
    scheduledJobs.get(jobKey)?.stop();
    scheduledJobs.delete(jobKey);
<<<<<<< HEAD
    logger.info('Stopped notification', { jobKey });
=======
    console.log(`Stopped notification: ${jobKey}`);
>>>>>>> 941ae72
    return { success: true };
  }
  
  return { success: false, error: 'Job not found' };
}

// Get all active jobs
export function getActiveJobs() {
  return Array.from(scheduledJobs.keys());
}

// Stop all jobs
export function stopAllJobs() {
  scheduledJobs.forEach((job) => job.stop());
  scheduledJobs.clear();
<<<<<<< HEAD
  logger.info('Stopped all scheduled notifications');
=======
  console.log('Stopped all scheduled notifications');
>>>>>>> 941ae72
}
