import cron from 'node-cron';
import { getCoinPrices } from '@/utils/sideshift-client';
import { setCachedPrice, clearAllCachedPrices } from '@/lib/database';
<<<<<<< HEAD
import logger from '@/lib/logger';
=======
>>>>>>> 941ae72

const CACHE_TTL_MINUTES = 6 * 60; // 6 hours

let priceRefreshJob: ReturnType<typeof cron.schedule> | null = null;

/**
 * Fetches coin prices from CoinGecko API and stores them in the database
 */
async function refreshPricesFromSideShift() {
<<<<<<< HEAD
  logger.info('[Price Refresh Cron] Starting price refresh from CoinGecko API');
  
  try {
    // Step 1: Clear all existing cached prices
    logger.info('[Price Refresh Cron] Clearing old cached prices');
    await clearAllCachedPrices();
    
    // Step 2: Fetch fresh price data from CoinGecko (via getCoinPrices)
    logger.info('[Price Refresh Cron] Fetching fresh coin prices from CoinGecko');
    const freshPrices = await getCoinPrices();
    logger.info('[Price Refresh Cron] Fetched coin prices', { count: freshPrices.length });
=======
  console.log('[Price Refresh Cron] Starting price refresh from CoinGecko API...');
  
  try {
    // Step 1: Clear all existing cached prices
    console.log('[Price Refresh Cron] Clearing old cached prices...');
    await clearAllCachedPrices();
    
    // Step 2: Fetch fresh price data from CoinGecko (via getCoinPrices)
    console.log('[Price Refresh Cron] Fetching fresh coin prices from CoinGecko...');
    const freshPrices = await getCoinPrices();
    console.log(`[Price Refresh Cron] Fetched ${freshPrices.length} coins with prices`);
>>>>>>> 941ae72
    
    // Log sample prices for debugging
    if (freshPrices.length > 0) {
      const sample = freshPrices[0];
<<<<<<< HEAD
      logger.debug('[Price Refresh Cron] Sample price', { 
        coin: sample.coin, 
        name: sample.name, 
        usdPrice: sample.usdPrice || 'N/A' 
      });
=======
      console.log(`[Price Refresh Cron] Sample: ${sample.coin} (${sample.name}) = $${sample.usdPrice || 'N/A'}`);
>>>>>>> 941ae72
    }
    
    let cachedCount = 0;
    let failedCount = 0;
    
    // Step 3: Cache all prices with error handling
    for (const price of freshPrices) {
      try {
        await setCachedPrice(
          price.coin,
          price.network,
          price.name,
          price.usdPrice,
          price.btcPrice,
          price.available,
          CACHE_TTL_MINUTES
        );
        cachedCount++;
      } catch (err) {
        failedCount++;
        if (failedCount <= 5) { // Only log first 5 failures to avoid spam
<<<<<<< HEAD
          logger.error('[Price Refresh Cron] Failed to cache price', { 
            coin: price.coin, 
            network: price.network,
            error: err instanceof Error ? err.message : String(err)
          });
=======
          console.error(`[Price Refresh Cron] Failed to cache ${price.coin}/${price.network}:`, err);
>>>>>>> 941ae72
        }
      }
    }
    
<<<<<<< HEAD
    logger.info('[Price Refresh Cron] Price caching completed', { 
      cached: cachedCount, 
      total: freshPrices.length, 
      failed: failedCount 
    });
    logger.info('[Price Refresh Cron] Price refresh completed successfully');
    
  } catch (error) {
    logger.error('[Price Refresh Cron] Error during price refresh', { 
      error: error instanceof Error ? error.message : String(error) 
    });
=======
    console.log(`[Price Refresh Cron] Successfully cached ${cachedCount}/${freshPrices.length} prices (${failedCount} failed)`);
    console.log('[Price Refresh Cron] Price refresh completed successfully');
    
  } catch (error) {
    console.error('[Price Refresh Cron] Error during price refresh:', error);
>>>>>>> 941ae72
    throw error;
  }
}

/**
 * Starts the cron job that refreshes prices every 6 hours
 */
export function startPriceRefreshCron() {
  if (priceRefreshJob) {
<<<<<<< HEAD
    logger.info('[Price Refresh Cron] Cron job already running');
=======
    console.log('[Price Refresh Cron] Cron job already running');
>>>>>>> 941ae72
    return;
  }
  
  // Run every 6 hours at minute 0: "0 */6 * * *"
  // For testing, you can use "*/5 * * * *" for every 5 minutes
  priceRefreshJob = cron.schedule('0 */6 * * *', async () => {
<<<<<<< HEAD
    logger.info('[Price Refresh Cron] Triggered scheduled price refresh');
    try {
      await refreshPricesFromSideShift();
    } catch (error) {
      logger.error('[Price Refresh Cron] Scheduled refresh failed', { 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  logger.info('[Price Refresh Cron] Cron job started - will run every 6 hours');
  
  // Run immediately on startup to populate the cache
  logger.info('[Price Refresh Cron] Running initial price refresh');
  refreshPricesFromSideShift().catch(err => {
    logger.error('[Price Refresh Cron] Initial refresh failed', { 
      error: err instanceof Error ? err.message : String(err) 
    });
=======
    console.log('[Price Refresh Cron] Triggered scheduled price refresh');
    try {
      await refreshPricesFromSideShift();
    } catch (error) {
      console.error('[Price Refresh Cron] Scheduled refresh failed:', error);
    }
  });
  
  console.log('[Price Refresh Cron] Cron job started - will run every 6 hours');
  
  // Run immediately on startup to populate the cache
  console.log('[Price Refresh Cron] Running initial price refresh...');
  refreshPricesFromSideShift().catch(err => {
    console.error('[Price Refresh Cron] Initial refresh failed:', err);
>>>>>>> 941ae72
  });
}

/**
 * Stops the cron job
 */
export function stopPriceRefreshCron() {
  if (priceRefreshJob) {
    priceRefreshJob.stop();
    priceRefreshJob = null;
<<<<<<< HEAD
    logger.info('[Price Refresh Cron] Cron job stopped');
=======
    console.log('[Price Refresh Cron] Cron job stopped');
>>>>>>> 941ae72
  }
}

/**
 * Manually trigger a price refresh (useful for testing or manual refresh)
 */
export async function triggerManualRefresh() {
<<<<<<< HEAD
  logger.info('[Price Refresh Cron] Manual refresh triggered');
=======
  console.log('[Price Refresh Cron] Manual refresh triggered');
>>>>>>> 941ae72
  await refreshPricesFromSideShift();
}
