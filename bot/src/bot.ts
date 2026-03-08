<<<<<<< HEAD
import { Telegraf, Context, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import rateLimit from 'telegraf-ratelimit';

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import logger, { Sentry, handleError } from './services/logger';
import { getOrderStatus } from './services/sideshift-client';
import { getTopStablecoinYields, formatYieldPools } from './services/yield-client';
import * as db from './services/database';
import { OrderMonitor } from './services/order-monitor';
import { parseUserCommand } from './services/parseUserCommand';
=======
import { Telegraf, Markup, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import rateLimit from 'telegraf-ratelimit';
import dotenv from 'dotenv';
import logger from './services/logger';
import { executePortfolioStrategy } from './services/portfolio-service';
import { transcribeAudio, ParsedCommand } from './services/groq-client';
import { parseUserCommand } from './services/parseUserCommand';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import axios from 'axios';
import { execFile } from 'child_process';
import express from 'express';
import { sql } from 'drizzle-orm';

// Services
import { transcribeAudio } from './services/groq-client';
import logger, { Sentry } from './services/logger';

import {
  getOrderStatus,
} from './services/sideshift-client';

import {
  getTopStablecoinYields,
  formatYieldPools,
} from './services/yield-client';

import * as db from './services/database';
import { DCAScheduler } from './services/dca-scheduler';
import { resolveAddress, isNamingService } from './services/address-resolver';
import { limitOrderWorker } from './workers/limitOrderWorker';
import { OrderMonitor } from './services/order-monitor';
import { parseUserCommand } from './services/parseUserCommand';
import { isValidAddress } from './config/address-patterns';
import { expressIntegration } from '@sentry/node';
>>>>>>> 941ae72

dotenv.config();

/* -------------------------------------------------------------------------- */
<<<<<<< HEAD
/* CONFIG */
=======
/* CONFIG                                                                     */
>>>>>>> 941ae72
/* -------------------------------------------------------------------------- */

const BOT_TOKEN = process.env.BOT_TOKEN!;
const MINI_APP_URL =
  process.env.MINI_APP_URL || 'https://swapsmithminiapp.netlify.app/';
const PORT = Number(process.env.PORT || 3000);

const bot = new Telegraf(BOT_TOKEN);

<<<<<<< HEAD
const orderMonitor = new OrderMonitor({
  getOrderStatus: (orderId) => getOrderStatus(orderId, process.env.SIDESHIFT_CLIENT_IP || '127.0.0.1'),
  updateOrderStatus: db.updateOrderStatus,
  updateWatchedOrderStatus: db.updateWatchedOrderStatus,
  getPendingOrders: db.getPendingOrders,
  getPendingWatchedOrders: db.getPendingWatchedOrders,
  addWatchedOrder: db.addWatchedOrder,
  onStatusChange: async (telegramId, orderId, oldStatus, newStatus, orderDetails) => {
    try {
      await bot.telegram.sendMessage(
        telegramId,
        `🔔 *Order Status Update*\n\nOrder \`${orderId}\` status changed to: *${newStatus.toUpperCase()}*`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      logger.error(`[Bot] Failed to send status update to ${telegramId}:`, error);
    }
  }
});

/* ---------------- Rate Limit ---------------- */

bot.use(
  rateLimit({
    window: 60000,
    limit: 20,
    keyGenerator: (ctx: Context) => ctx.from?.id?.toString() || 'unknown',
    onLimitExceeded: async (ctx: Context) => {
      await ctx.reply('⚠️ Too many requests. Please slow down.');
    },
  })
);

const app = express();

/* ---------------- CORS ---------------- */

const allowedOrigins = [
  MINI_APP_URL,
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error(
            'The CORS policy for this site does not allow access from the specified Origin.'
          )
        );
      }

      return callback(null, true);
    },
  })
);

app.use(express.json());

/* -------------------------------------------------------------------------- */
/* COMMANDS */
/* -------------------------------------------------------------------------- */

bot.start((ctx: Context) =>
  ctx.reply(
    `🤖 *Welcome to SwapSmith!*\n\nVoice-enabled crypto trading assistant.`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.url('🌐 Open Web App', MINI_APP_URL),
      ]),
    }
  )
);

bot.command('yield', async (ctx: Context) => {
  await ctx.reply('📈 Fetching top yield opportunities...');

  try {
    const yields = await getTopStablecoinYields();

    await ctx.replyWithMarkdown(
      `📈 *Top Stablecoin Yields:*\n\n${formatYieldPools(yields)}`
    );
  } catch {
    await ctx.reply('❌ Failed to fetch yields.');
  }
});

bot.command('clear', async (ctx: Context) => {
  if (!ctx.from) return;

  await db.clearConversationState(ctx.from.id);
  await ctx.reply('🗑️ Conversation cleared');
});

/* -------------------------------------------------------------------------- */
/* MESSAGE HANDLERS */
/* -------------------------------------------------------------------------- */

const FREQUENCY_TO_HOURS: Record<string, number> = {
  'daily': 24,
  'weekly': 24 * 7,
  'bi-weekly': 24 * 14,
  'monthly': 24 * 30,
  'quarterly': 24 * 90
};

bot.on(message('text'), async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;

  const userId = ctx.from.id;
  const userInput = ctx.message.text;

  // Temporary: Retrieve conversation history implementation pending
  const conversationHistory: any[] = [];

  const parsed = await parseUserCommand(userInput, conversationHistory);

  if (!parsed.success) {
    if (parsed.validationErrors && parsed.validationErrors.length > 0) {
      await ctx.reply(`❌ I couldn't understand that completely: ${parsed.validationErrors.join(', ')}`);
    } else {
      await ctx.reply("🤔 I'm not sure what you mean. Could you rephrase?");
    }
    return;
  }

  // Save state for confirmation
  await db.setConversationState(userId, {
    parsedCommand: parsed as any, // Cast to any to avoid strict type checks on json field if needed
    step: 'confirm'
  });

  if (parsed.intent === 'dca') {
    const message = `📅 *Confirm DCA Plan*\n\n` +
      `Amount: $${parsed.amount}\n` +
      `From: ${parsed.fromAsset || 'USDC'}\n` + 
      `To: ${parsed.toAsset}\n` +
      `Frequency: ${parsed.frequency}\n` +
      (parsed.dayOfWeek ? `Day: ${parsed.dayOfWeek}\n` : '') +
      `\nReady to schedule?`;
    
    await ctx.replyWithMarkdown(message, Markup.inlineKeyboard([
      Markup.button.callback('✅ Confirm DCA', 'confirm_dca'),
      Markup.button.callback('❌ Cancel', 'cancel_action')
    ]));
  } else if (parsed.intent === 'limit_order') {
    const message = `🛡️ *Confirm Limit Order*\n\n` +
      `Action: ${parsed.condition === 'above' ? `Sell ${parsed.fromAsset}` : `Buy ${parsed.toAsset}`}\n` +
      `Condition: Price of ${parsed.conditionAsset || parsed.toAsset} ${parsed.condition} $${parsed.targetPrice}\n` +
      `Amount: ${parsed.amount} ${parsed.condition === 'above' ? parsed.fromAsset : parsed.toAsset}\n` +
      `\nSet this order?`;
    
    await ctx.replyWithMarkdown(message, Markup.inlineKeyboard([
      Markup.button.callback('✅ Confirm Order', 'confirm_limit_order'),
      Markup.button.callback('❌ Cancel', 'cancel_action')
    ]));
  } else if (parsed.intent === 'swap' || parsed.intent === 'swap_and_stake') {
    // Existing swap handling or pass through
    await ctx.reply(`Swaps unimplemented in this snippet. Intent: ${parsed.intent}`);
  } else {
    // Handle other intents or default
    await ctx.reply(`Intent detected: ${parsed.intent}. (Implementation pending)`);
=======
// Configure rate limiting middleware
const limit = rateLimit({
  window: 60000, // 1 minute window
  limit: 20, // Maximum 20 messages per window per user
  keyGenerator: (ctx) => {
    return ctx.from?.id.toString() || 'unknown';
  },
  onLimitExceeded: async (ctx) => {
    await ctx.reply('⚠️ Too many requests! Please slow down. Rate limit: 20 messages per minute.');
  },
});

// Apply rate limiting middleware
bot.use(limit);

const app = express();
app.use(express.json());

/* -------------------------------------------------------------------------- */
/* ORDER MONITOR                                                              */
/* -------------------------------------------------------------------------- */

const orderMonitor = new OrderMonitor({
  getOrderStatus,
  updateOrderStatus: db.updateOrderStatus,
  getPendingOrders: db.getPendingOrders,
  onStatusChange: async (telegramId, orderId, oldStatus, newStatus, details) => {
    const emojiMap: Record<string, string> = {
      waiting: '⏳',
      pending: '⏳',
      processing: '⚙️',
      settling: '📤',
      settled: '✅',
      refunded: '↩️',
      expired: '⏰',
      failed: '❌',
    };

    const msg =
      `${emojiMap[newStatus] || '🔔'} *Order Update*\n\n` +
      `*Order:* \`${orderId}\`\n` +
      `*Status:* ${oldStatus} → *${newStatus.toUpperCase()}*\n` +
      (details?.depositAmount
        ? `*Sent:* ${details.depositAmount} ${details.depositCoin}\n`
        : '') +
      (details?.settleAmount
        ? `*Received:* ${details.settleAmount} ${details.settleCoin}\n`
        : '') +
      (details?.settleHash
        ? `*Tx:* \`${details.settleHash.slice(0, 16)}...\`\n`
        : '');

    try {
      await bot.telegram.sendMessage(telegramId, msg, {
        parse_mode: 'Markdown',
      });
    } catch (e) {
      logger.error('Order update notify failed:', e);
    }
  },
});

/* -------------------------------------------------------------------------- */
/* COMMANDS                                                                   */
/* -------------------------------------------------------------------------- */

bot.start((ctx) =>
  ctx.reply(`🤖 *Welcome to SwapSmith!*\n\nVoice-enabled crypto trading assistant.`, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      Markup.button.url('🌐 Open Web App', MINI_APP_URL),
    ]),
  })
);

bot.command('yield', async (ctx) => {
  await ctx.reply('📈 Fetching top yield opportunities...');
  try {
    const yields = await getTopStablecoinYields();
    ctx.replyWithMarkdown(`📈 *Top Stablecoin Yields:*\n\n${formatYieldPools(yields)}`);
  } catch {
    ctx.reply('❌ Failed to fetch yields.');
  }
});


bot.command('clear', async (ctx) => {
  if (ctx.from) {
    await db.clearConversationState(ctx.from.id);
    ctx.reply('🗑️ Conversation cleared');
  }
});

/* -------------------------------------------------------------------------- */
/* MESSAGE HANDLERS                                                           */
/* -------------------------------------------------------------------------- */

bot.on(message('text'), async (ctx) => {
  if (!ctx.message.text.startsWith('/')) {
    await handleTextMessage(ctx, ctx.message.text);
  }
});

bot.on(message('voice'), async (ctx) => {
  await ctx.reply('👂 Listening...');
  const fileId = ctx.message.voice.file_id;
  const fileLink = await ctx.telegram.getFileLink(fileId);

  const oga = path.join(os.tmpdir(), `${Date.now()}.oga`);
  const mp3 = oga.replace('.oga', '.mp3');

  try {
    const res = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
    fs.writeFileSync(oga, res.data);

    await new Promise<void>((resolve, reject) =>
      execFile('ffmpeg', ['-i', oga, mp3, '-y'], (e) => (e ? reject(e) : resolve()))
    );

    const text = await transcribeAudio(mp3);
    await handleTextMessage(ctx, text, 'voice');
  } finally {
    fs.existsSync(oga) && fs.unlinkSync(oga);
    fs.existsSync(mp3) && fs.unlinkSync(mp3);
>>>>>>> 941ae72
  }
});

/* -------------------------------------------------------------------------- */
<<<<<<< HEAD
/* ACTIONS */
/* -------------------------------------------------------------------------- */

bot.action('confirm_dca', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const state = await db.getConversationState(userId);
  if (!state?.parsedCommand || state.parsedCommand.intent !== 'dca') {
    return ctx.answerCbQuery('Session expired.');
  }

  try {
    const parsed = state.parsedCommand;
    const hours = FREQUENCY_TO_HOURS[parsed.frequency as string] || 24;

    await db.db.insert(db.dcaSchedules).values({
      telegramId: userId,
      fromAsset: parsed.fromAsset || 'USDC',
      fromNetwork: 'ethereum', // Default
      toAsset: parsed.toAsset || 'BTC',
      toNetwork: 'bitcoin', // Default
      amountPerOrder: parsed.amount?.toString() || '0',
      intervalHours: hours,
      totalOrders: 100, // Default infinite-ish
      isActive: 1,
      nextExecutionAt: new Date(Date.now() + hours * 60 * 60 * 1000)
    });

    await ctx.answerCbQuery('DCA Scheduled!');
    await ctx.editMessageText(`✅ DCA Scheduled: $${parsed.amount} ${parsed.toAsset} every ${parsed.frequency}.`);
  } catch (error) {
    logger.error('DCA Creation Error', error);
    await ctx.editMessageText('❌ Failed to schedule DCA.');
  } finally {
    await db.clearConversationState(userId);
  }
=======
/* CORE HANDLER                                                               */
/* -------------------------------------------------------------------------- */

async function handleTextMessage(
  ctx: Context,
  text: string,
  inputType: 'text' | 'voice' = 'text'
) {
  if (!ctx.from) return;

  const userId = ctx.from.id;
  const state = await db.getConversationState(userId);

  /* ---------------- Address Resolution ---------------- */

  if (
    state?.parsedCommand &&
    !state.parsedCommand.settleAddress &&
    ['swap', 'checkout', 'portfolio', 'limit_order'].includes(
      state.parsedCommand.intent
    )
  ) {
    const resolved = await resolveAddress(userId, text.trim());
    const targetChain =
      state.parsedCommand.toChain ||
      state.parsedCommand.settleNetwork ||
      state.parsedCommand.fromChain ||
      'ethereum';

    if (resolved.address && isValidAddress(resolved.address, targetChain)) {
      const updated = { ...state.parsedCommand, settleAddress: resolved.address };
      await db.setConversationState(userId, { parsedCommand: updated });

      return ctx.reply(
        `✅ Address resolved:\n\`${resolved.originalInput}\` → \`${resolved.address}\``,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            Markup.button.callback('✅ Yes', `confirm_${updated.intent}`),
            Markup.button.callback('❌ No', 'cancel_swap'),
          ]),
        }
      );
    }

    if (isNamingService(text)) {
      return ctx.reply(
        `❌ Could not resolve \`${text}\`. Please try a raw address.`,
        { parse_mode: 'Markdown' }
      );
    }
  }

  /* ---------------- NLP Parsing ---------------- */

  const parsed = await parseUserCommand(text, state?.messages || [], inputType);
  if (!parsed.success) {
    return ctx.replyWithMarkdown(
      (parsed as any).validationErrors?.join('\n') ||
        '❌ I didn’t understand.'
    );
  }

  /* ---------------- Yield Scout ---------------- */

  if (parsed.intent === 'yield_scout') {
    const yields = await getTopStablecoinYields();
    return ctx.replyWithMarkdown(
      `📈 *Top Stablecoin Yields:*\n\n${formatYieldPools(yields)}`
    );
  }

  /* ---------------- Portfolio ---------------- */

  if (parsed.intent === 'portfolio') {
    await db.setConversationState(userId, { parsedCommand: parsed });

    let msg = `📊 *Portfolio Strategy*\n\n`;
    parsed.portfolio?.forEach((p: any) => {
      msg += `• ${p.percentage}% → ${p.toAsset} on ${p.toChain}\n`;
    });

    return ctx.replyWithMarkdown(
      msg,
      Markup.inlineKeyboard([
        Markup.button.webApp('📱 Batch Sign', MINI_APP_URL),
        Markup.button.callback('❌ Cancel', 'cancel_swap'),
      ]),
    }
  );
>>>>>>> 941ae72
});

bot.action(/deposit_(.+)/, async (ctx) => {
  const poolId = ctx.match[1];
<<<<<<< HEAD
  await ctx.answerCbQuery();
  await ctx.reply(`🚀 Starting deposit flow for pool: ${poolId}`);
});

bot.action('confirm_limit_order', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const state = await db.getConversationState(userId);

  if (!state?.parsedCommand || state.parsedCommand.intent !== 'limit_order') {
    return ctx.answerCbQuery('Session expired.');
  }

  try {
    const parsed = state.parsedCommand;
    await db.db.insert(db.limitOrders).values({
      telegramId: userId,
      fromAsset: parsed.fromAsset || 'ETH',
      fromNetwork: 'ethereum',
      toAsset: parsed.toAsset || 'USDC',
      toNetwork: 'ethereum',
      fromAmount: parsed.amount?.toString() || '0',
      conditionOperator: parsed.conditionOperator || (parsed.condition === 'above' ? 'gt' : 'lt'),
      conditionValue: parsed.targetPrice || 0,
      conditionAsset: parsed.conditionAsset || parsed.toAsset || 'ETH',
      isActive: 1,
      status: 'pending'
    });

    await ctx.answerCbQuery('Processing...');
    await ctx.editMessageText(`✅ Limit order created! Alert when ${parsed.conditionAsset} ${parsed.condition} $${parsed.targetPrice}`);
  } catch (error) {
    logger.error('Limit Order Creation Error', error);
    await ctx.editMessageText('❌ Failed to create limit order.');
  } finally {
    await db.clearConversationState(userId);
  }
});

bot.action('cancel_action', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  await db.clearConversationState(userId);
  await ctx.editMessageText('❌ Action Cancelled.');
});

bot.action('confirm_swap_and_stake', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const state = await db.getConversationState(userId);

  if (!state?.parsedCommand || state.parsedCommand.intent !== 'swap_and_stake') {
    return ctx.answerCbQuery('Session expired.');
  }

  try {
    await ctx.answerCbQuery('Processing...');
    await ctx.editMessageText('⚙️ Creating swap & stake order...');

    const parsed = state.parsedCommand;

    const { getZapQuote, createZapTransaction, formatZapQuote } =
      await import('./services/stake-client');

    const fromNetwork = parsed.fromChain || 'ethereum';
    const toNetwork = parsed.toChain || 'ethereum';

    const zapQuote = await getZapQuote(
      parsed.fromAsset,
      fromNetwork,
      parsed.toAsset,
      toNetwork,
      parsed.amount,
      process.env.SIDESHIFT_CLIENT_IP || '127.0.0.1',
      toNetwork
    );

    const quoteMessage = formatZapQuote(zapQuote);
    await ctx.editMessageText(quoteMessage, { parse_mode: 'Markdown' });

    const zapTx = await createZapTransaction(
      zapQuote,
      parsed.settleAddress,
      process.env.SIDESHIFT_CLIENT_IP || '127.0.0.1'
    );

    await db.createStakeOrder({
      telegramId: userId,
      sideshiftOrderId: zapTx.swapOrderId,
      quoteId: zapQuote.stakePool.poolId || zapTx.swapOrderId,
      fromAsset: parsed.fromAsset,
      fromNetwork,
      fromAmount: parsed.amount,
      swapToAsset: parsed.toAsset,
      swapToNetwork: toNetwork,
      stakeAsset: parsed.toAsset,
      stakeProtocol: zapQuote.protocolName,
      stakeNetwork: toNetwork,
      depositAddress: zapQuote.depositAddress,
      stakeAddress: parsed.settleAddress,
    });

    orderMonitor.trackOrder(zapTx.swapOrderId, userId);

    const swapOrderStatus = await getOrderStatus(zapTx.swapOrderId);

    const depositAddress =
      typeof swapOrderStatus.depositAddress === 'string'
        ? swapOrderStatus.depositAddress
        : swapOrderStatus.depositAddress.address;

    const depositMemo =
      typeof swapOrderStatus.depositAddress === 'object'
        ? swapOrderStatus.depositAddress.memo
        : null;

    await ctx.reply(
      `✅ *Swap & Stake Order Created!*\n\n` +
        `*Order ID:* \`${zapTx.swapOrderId}\`\n\n` +
        `Send *${parsed.amount} ${parsed.fromAsset}* to:\n` +
        `\`${depositAddress}\`\n` +
        (depositMemo ? `Memo: \`${depositMemo}\`\n` : ''),
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    handleError('SwapAndStakeError', error, null, true, 'high');
    await ctx.editMessageText(
      '❌ Failed to create swap & stake order. Please try again later.'
    );
  } finally {
    await db.clearConversationState(userId);
  }
});

bot.action('cancel_swap', async (ctx) => {
  if (!ctx.from) return;

  await db.clearConversationState(ctx.from.id);
  await ctx.editMessageText('❌ Cancelled');
});

/* -------------------------------------------------------------------------- */
/* STARTUP */
/* -------------------------------------------------------------------------- */

async function start() {
  try {
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
=======

  await ctx.answerCbQuery();
  ctx.reply(`🚀 Starting deposit flow for pool: ${poolId}`);
});


bot.action('place_order', async (ctx) => {
  const state = await db.getConversationState(ctx.from.id);
  if (!state?.quoteId) return;

  const order = await createOrder(
    state.quoteId,
    state.parsedCommand.settleAddress,
    state.parsedCommand.settleAddress
  );

  await db.createOrderEntry(
    ctx.from.id,
    state.parsedCommand,
    order,
    state.settleAmount,
    state.quoteId
  );

  await db.addWatchedOrder(ctx.from.id, order.id, 'pending');

  ctx.editMessageText(
    `✅ *Order Created*\n\nSign transaction to complete.`,
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.webApp(
          '📱 Sign Transaction',
          `${MINI_APP_URL}?to=${order.depositAddress}`
        ),
      ]),
    }
  );
});

bot.action('confirm_checkout', async (ctx) => {
  const userId = ctx.from.id;
  const state = await db.getConversationState(userId);
  if (!state?.parsedCommand || state.parsedCommand.intent !== 'checkout') return ctx.answerCbQuery('Start over.');

  try {
    await ctx.answerCbQuery('Creating link...');
    const { settleAsset, settleNetwork, settleAmount, settleAddress } = state.parsedCommand;
    const checkout = await createCheckout(settleAsset!, settleNetwork!, settleAmount!, settleAddress!);
    if (!checkout?.id) throw new Error("API Error");

    db.createCheckoutEntry(userId, checkout);
    ctx.editMessageText(`✅ *Checkout Link Created!*\n💰 *Receive:* ${checkout.settleAmount} ${checkout.settleCoin}\n[Pay Here](https://pay.sideshift.ai/checkout/${checkout.id})`, {
      parse_mode: 'Markdown',
      link_preview_options: { is_disabled: true }
    });
  } catch (error) {
    ctx.editMessageText(`Error creating link.`);
  } finally {
    db.clearConversationState(userId);
  }
});

bot.action('confirm_portfolio', async (ctx) => {
  const userId = ctx.from.id;
  const state = await db.getConversationState(userId);
  if (!state?.parsedCommand || state.parsedCommand.intent !== 'portfolio') return ctx.answerCbQuery('Session expired.');

  const { fromAsset, fromChain, amount, portfolio, settleAddress } = state.parsedCommand;

  // 1. Validate Input
  if (!portfolio || portfolio.length === 0) {
    return ctx.editMessageText('❌ No portfolio allocation found.');
  }

  const totalPercentage = portfolio.reduce((sum: number, p: NonNullable<ParsedCommand['portfolio']>[number]) => sum + p.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 1) { // Allow 1% tolerance
    return ctx.editMessageText(`❌ Portfolio percentages must sum to 100% (Current: ${totalPercentage}%)`);
  }

  if (!amount || amount <= 0) {
    return ctx.editMessageText('❌ Invalid amount.');
  }

  /* ---------------- Limit Order ---------------- */

  if (parsed.intent === 'limit_order') {
    if (!parsed.settleAddress) {
      await db.setConversationState(userId, { parsedCommand: parsed });
      return ctx.reply('Please provide the destination wallet address.');
    }

    await db.setConversationState(userId, { parsedCommand: parsed });

    return ctx.reply(
      'Confirm Limit Order?',
      Markup.inlineKeyboard([
        Markup.button.callback('✅ Yes', 'confirm_limit_order'),
        Markup.button.callback('❌ Cancel', 'cancel_swap'),
      ])
    );
  }


  /* ---------------- Swap / Checkout ---------------- */

  if (['swap', 'checkout'].includes(parsed.intent)) {
    if (!parsed.settleAddress) {
      await db.setConversationState(userId, { parsedCommand: parsed });
      return ctx.reply('Please provide the destination wallet address.');
    }

    await db.setConversationState(userId, { parsedCommand: parsed });

    return ctx.reply(
      'Confirm parameters?',
      Markup.inlineKeyboard([
        Markup.button.callback('✅ Yes', `confirm_${parsed.intent}`),
        Markup.button.callback('❌ Cancel', 'cancel_swap'),
      ])
    );
  }
}

/* -------------------------------------------------------------------------- */
/* ACTIONS                                                                    */
/* -------------------------------------------------------------------------- */

bot.action('cancel_swap', async (ctx) => {
  if (!ctx.from) return;
  await db.clearConversationState(ctx.from.id);
  ctx.editMessageText('❌ Cancelled');
});

/* -------------------------------------------------------------------------- */
/* STARTUP                                                                    */
/* -------------------------------------------------------------------------- */

const dcaScheduler = new DCAScheduler();

async function start() {
  try {
    // Add Sentry request handler for Express
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [expressIntegration()],
>>>>>>> 941ae72
        tracesSampleRate: 1.0,
      });
    }

<<<<<<< HEAD
    await orderMonitor.loadPendingOrders();
    orderMonitor.start();

    await bot.telegram.deleteWebhook({ drop_pending_updates: true });

    await bot.launch();
    logger.info('🤖 Bot launched');

=======
    if (process.env.DATABASE_URL) {
      await db.db.execute(sql`SELECT 1`);
      dcaScheduler.start();
      limitOrderWorker.start(bot);
    }

    await orderMonitor.loadPendingOrders();
    orderMonitor.start();

>>>>>>> 941ae72
    const server = app.listen(PORT, () =>
      logger.info(`🌍 Server running on port ${PORT}`)
    );

<<<<<<< HEAD
    const shutdown = async (signal: string) => {
      logger.info(`🛑 Shutdown (${signal})`);

      orderMonitor.stop();
      bot.stop(signal);

      await new Promise<void>((resolve) => server.close(() => resolve()));

      process.exit(0);
=======
    await bot.launch();
    logger.info('🤖 Bot launched');

    const shutdown = (signal: string) => {
      dcaScheduler.stop();
      limitOrderWorker.stop();
      orderMonitor.stop();
      bot.stop(signal);
      server.close(() => process.exit(0));
>>>>>>> 941ae72
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  } catch (e) {
<<<<<<< HEAD
    handleError('StartupFailed', e, null, true, 'critical');
=======
    logger.error('Startup failed', e);
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(e);
    }
>>>>>>> 941ae72
    process.exit(1);
  }
}

<<<<<<< HEAD
start();
=======
start();
>>>>>>> 941ae72
