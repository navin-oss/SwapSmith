import { parseWithLLM, ParsedCommand } from './groq-client';
import logger from './logger';
<<<<<<< HEAD
import { parseDCA } from './nl-dca';
import { detectLimitOrder } from './nl-limit-orders';

export { ParsedCommand };

export type ParseResult =
  | ParsedCommand
  | {
=======

export { ParsedCommand };

// Define a union type for the result to handle validationErrors safely
export type ParseResult = ParsedCommand | {
>>>>>>> 941ae72
    success: false;
    validationErrors: string[];
    intent?: string;
    confidence?: number;
    parsedMessage?: string;
    requiresConfirmation?: boolean;
    originalInput?: string;
    [key: string]: any;
<<<<<<< HEAD
  };

const REGEX_TOKENS = /([A-Z]{2,10})\s+(to|into|for|→|->)\s+([A-Z]{2,10})/i;
const REGEX_FROM_TO = /from\s+([A-Z]{2,10})\s+to\s+([A-Z]{2,10})/i;
const REGEX_AMOUNT_TOKEN = /\b(\d+(?:\.\d+)?[kmb]?)\s+([A-Z]{2,10})\b/i;
const REGEX_MULTI_SOURCE =
  /(?:^|\s)([A-Z]{2,10}|(?:\d+(?:\.\d+)?[kmb]?\s+[A-Z]{2,10}))\s+(?:and|&|\+)\s+([A-Z]{2,10}|(?:\d+(?:\.\d+)?[kmb]?\s+[A-Z]{2,10}))\s+(?:to|into|for)/i;

// Enhanced patterns for better ambiguity detection
const REGEX_AMBIGUOUS_OR = /\b(or|either|maybe)\b/i;
const REGEX_MULTIPLE_DESTINATIONS = /(?:to|into|for)\s+([A-Z]{2,10})(?:\s+(?:or|and|\+|,)\s+([A-Z]{2,10}))+/i;
const REGEX_CONDITIONAL = /\b(if|when|only\s+if|provided|assuming)\b/i;
const REGEX_PRICE_CONDITION = /(?:price|value|[A-Z]{2,10})\s*(?:is|goes|hits|reaches|drops?|rises?|falls?)?\s*(above|below|over|under|>|<|>=|<=)\s*\$?(\d+(?:\.\d+)?[kmb]?)/i;

// Enhanced abbreviation handling
const COMMON_TYPOS = {
  'swp': 'swap',
  'cnvrt': 'convert',
  'exchng': 'exchange',
  'trd': 'trade',
  'pls': 'please',
  '2': 'to',
  '4': 'for',
  'u': 'you',
  'ur': 'your',
  'btc': 'BTC',
  'eth': 'ETH',
  'usdc': 'USDC',
  'usdt': 'USDT',
  'bnb': 'BNB',
  'sol': 'SOL',
  'ada': 'ADA',
  'dot': 'DOT',
  'matic': 'MATIC',
  'avax': 'AVAX'
};

// Voice input phonetic corrections
const PHONETIC_CORRECTIONS = {
  'eeth': 'ETH',
  'bit coin': 'BTC',
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'you es dee see': 'USDC',
  'tether': 'USDT',
  'solana': 'SOL',
  'cardano': 'ADA',
  'polkadot': 'DOT',
  'polygon': 'MATIC',
  'avalanche': 'AVAX',
  'won': '1',
  'too': '2',
  'tree': '3',
  'for': '4',
  'fiv': '5'
};

// Enhanced number parsing with better scaling
const parseScaledNumber = (raw: string): number => {
  const cleaned = raw.replace(/[$,\s]/g, '').toLowerCase();
  const numPart = cleaned.replace(/[kmb]/g, '');
  const base = parseFloat(numPart);
  
  if (isNaN(base)) return NaN;
  
  if (cleaned.includes('k')) return base * 1000;
  if (cleaned.includes('m')) return base * 1000000;
  if (cleaned.includes('b')) return base * 1000000000;
  return base;
};

// Enhanced input preprocessing
const preprocessInput = (input: string): string => {
  let processed = input.toLowerCase().trim();
  
  // Apply common typo corrections
  Object.entries(COMMON_TYPOS).forEach(([typo, correction]) => {
    const regex = new RegExp(`\\b${typo}\\b`, 'gi');
    processed = processed.replace(regex, correction);
  });
  
  // Apply phonetic corrections for voice input
  Object.entries(PHONETIC_CORRECTIONS).forEach(([phonetic, correction]) => {
    const regex = new RegExp(`\\b${phonetic}\\b`, 'gi');
    processed = processed.replace(regex, correction);
  });
  
  processed = processed.replace(/[-–—]/g, ' to ');
  processed = processed.replace(/→|->/g, ' to ');
  
  return processed;
};

// Enhanced staking patterns for better natural language support
const REGEX_SWAP_STAKE = /(?:swap\s+and\s+stake|zap\s+(?:into|to)|stake\s+(?:my|after|then)|swap\s+(?:to|into)\s+(?:stake|yield))/i;
const REGEX_STAKE_PROTOCOL = /(?:to\s+)?(aave|compound|yearn|lido|morpho|euler|spark|rocket\s*pool|stakewise)/i;

// Enhanced regex for direct stake commands with better natural language support
const REGEX_STAKE_COMMAND = /\b(stake|staking)\b/i;
const REGEX_LIQUID_STAKING_PROVIDER = /\b(lido|rocket\s*pool|rocketpool|stakewise|stake\s*wise|marinade|benqi|ankr)\b/i;

// Enhanced patterns for amount detection in staking commands
const REGEX_STAKE_AMOUNT = /(?:stake|staking)\s+(?:my\s+)?(?:all\s+)?(?:(\d+(?:\.\d+)?[kmb]?)\s+)?([A-Z]{2,10})/i;
const REGEX_STAKE_ALL = /\b(?:stake|staking)\s+(?:all|everything|my\s+entire|my\s+whole)\s+([A-Z]{2,10})/i;
const REGEX_STAKE_PERCENTAGE = /(?:stake|staking)\s+(\d+(?:\.\d+)?)%\s+(?:of\s+)?(?:my\s+)?([A-Z]{2,10})/i;

const buildSwapResult = (
  userInput: string,
  {
    intent,
    fromAsset,
    toAsset,
    amount,
    amountType,
    excludeAmount,
    excludeToken,
    quoteAmount,
    conditions,
    conditionOperator,
    conditionValue,
    conditionAsset,
    confidence,
    requiresConfirmation
  }: Partial<ParsedCommand> & { intent: ParsedCommand['intent']; confidence: number }
): ParsedCommand => ({
  success: true,
  intent,
  fromAsset: fromAsset ?? null,
  fromChain: null,
  toAsset: toAsset ?? 'USDC',
  toChain: null,
  amount: amount ?? null,
  amountType: amountType ?? null,
  excludeAmount,
  excludeToken,
  quoteAmount,
  conditions,
  portfolio: undefined,
  frequency: null,
  dayOfWeek: null,
  dayOfMonth: null,
  settleAsset: null,
  settleNetwork: null,
  settleAmount: null,
  settleAddress: null,
  fromProject: null,
  fromYield: null,
  toProject: null,
  toYield: null,
  conditionOperator,
  conditionValue,
  conditionAsset,
  targetPrice: conditionValue,
  condition: conditionOperator === 'gt' ? 'above' : conditionOperator === 'lt' ? 'below' : undefined,
  confidence,
  validationErrors: [],
  parsedMessage: `Parsed: Swap ${amount ?? '?'} ${fromAsset ?? '?'} → ${toAsset ?? 'USDC'}`,
  requiresConfirmation: requiresConfirmation ?? false,
  originalInput: userInput
});

export async function parseUserCommand(
  userInput: string,
  conversationHistory: any = [], // Replaced fallbackToLLM to fix "Cannot find name" errors
  inputType: 'text' | 'voice' = 'text'
): Promise<ParseResult> {
  // Graceful handling if someone passes a boolean for legacy fallbackToLLM
  if (typeof conversationHistory === 'boolean') {
    conversationHistory = [];
  }

  if (!userInput?.trim()) {
    return {
      success: false,
      validationErrors: ['Input cannot be empty'],
      confidence: 0,
      parsedMessage: 'No input provided',
      requiresConfirmation: false,
      originalInput: userInput
    };
  }

  const originalInput = userInput;
  const preprocessedInput = preprocessInput(userInput);
  
  // Enhanced ambiguity detection
  const hasAmbiguousOr = REGEX_AMBIGUOUS_OR.test(preprocessedInput);
  const hasMultipleDestinations = REGEX_MULTIPLE_DESTINATIONS.test(preprocessedInput);
  const hasConditionals = REGEX_CONDITIONAL.test(preprocessedInput);
  
  if (hasAmbiguousOr || hasMultipleDestinations) {
    const destinations = preprocessedInput.match(REGEX_MULTIPLE_DESTINATIONS);
    return {
      success: false, // <-- FIXED: Must be false for partial/ambiguous results
      intent: 'swap',
      validationErrors: destinations 
        ? [`Multiple destination assets detected: ${destinations[1]}, ${destinations[2]}. Please specify one.`]
        : ['Command contains ambiguous language. Please be more specific.'],
      confidence: 20,
      parsedMessage: 'Ambiguous command detected - clarification needed',
      requiresConfirmation: true,
      originalInput
    };
  }

  // Enhanced conditional parsing
  if (hasConditionals) {
    const priceCondition = preprocessedInput.match(REGEX_PRICE_CONDITION);
    if (priceCondition) {
      const [, operator, rawValue] = priceCondition;
      const value = parseScaledNumber(rawValue);
      
      if (!isNaN(value)) {
        const conditionType = ['above', 'over', '>', '>='].includes(operator.toLowerCase()) 
          ? 'price_above' : 'price_below';
        
        // Try to extract basic swap info
        const tokenMatch = preprocessedInput.match(REGEX_TOKENS);
        const amountMatch = preprocessedInput.match(REGEX_AMOUNT_TOKEN);
        
        return buildSwapResult(originalInput, {
          intent: 'limit_order', // Changed from 'swap' to 'limit_order' for conditional orders
          fromAsset: tokenMatch?.[1] || (amountMatch?.[2]),
          toAsset: tokenMatch?.[3],
          amount: amountMatch ? parseScaledNumber(amountMatch[1]) : null,
          amountType: amountMatch ? 'exact' : null,
          conditions: {
            type: conditionType as "price_above" | "price_below",
            asset: tokenMatch?.[3] || 'BTC', // Default to BTC if not specified
            value
            // <-- FIXED: Removed invalid 'operator' property from this object
          },
          confidence: 75,
          requiresConfirmation: true
        });
      }
    }
  }

  let input = userInput
    .trim()
    .replace(/^(hey|hi|hello|please|kindly|can you)\s+/i, '')
    .replace(/[!?.,]+$/g, '')
    .replace(/\s+(please|kindly|immediately|now|right now)$/i, '')
    .replace(/\blike\b/gi, '')
    .trim();

  if (REGEX_SWAP_STAKE.test(input)) {
    const protocolMatch = input.match(REGEX_STAKE_PROTOCOL);
    const stakeProtocol = protocolMatch?.[1]?.toLowerCase() ?? null;

    let amount: number | null = null;
    let fromAsset: string | null = null;
    let toAsset: string | null = null;

    const amtMatch = input.match(/\b(\d+(\.\d+)?)\b/);
    if (amtMatch) amount = parseFloat(amtMatch[1]);

    const fromToMatch = input.match(/([A-Z]{2,10})\s+(?:to|into|for)\s+([A-Z]{2,10})/i);
=======
};

// Regex Patterns
const REGEX_EXCLUSION = /(?:everything|all|entire|max)\s*(?:[A-Z]+\s+)?(?:except|but\s+keep)\s+(\d+(\.\d+)?)\s*([A-Z]+)?/i;
const REGEX_PERCENTAGE = /(\d+(\.\d+)?)\s*(?:%|percent)\s*(?:of\s+(?:my\s+)?)?([A-Z]+)?/i;
const REGEX_HALF = /\b(half)\b\s*(?:of\s+(?:my\s+)?)?([A-Z]+)?/i;
const REGEX_QUARTER = /\b(quarter)\b\s*(?:of\s+(?:my\s+)?)?([A-Z]+)?/i;
const REGEX_MAX_ALL = /\b(max|all|everything|entire)\b/i;
const REGEX_ALL_TOKEN = /(max|all|everything|entire)\s+([A-Z]+)/i; // "all ETH"

const REGEX_TOKENS = /([A-Z]+)\s+(to|into|for)\s+([A-Z]+)/i; // "ETH to BTC"
const REGEX_FROM_TO = /from\s+([A-Z]+)\s+to\s+([A-Z]+)/i; // "from ETH to BTC"
const REGEX_AMOUNT_TOKEN = /\b(\d+(\.\d+)?)\s+(?!to|into|for|from|with|using\b)([A-Z]+)\b/i; // "10 ETH" (exclude prepositions)

// New Regex for Conditions
const REGEX_CONDITION = /(?:if|when)\s+(?:the\s+)?(?:price|rate|market|value)?\s*(?:of\s+)?([A-Z]+)?\s*(?:is|goes|drops|rises|falls)?\s*(above|below|greater|less|more|under|>|<)\s*(?:than)?\s*(\$?[\d,]+(\.\d+)?\s*[kKmM]?)/i;

// New Regex for Quote Amount ("Worth")
const REGEX_QUOTE = /(?:([A-Z]+)\s+)?(?:worth|value|valued\s+at)\s*(?:of)?\s*(\$)?(\d+(\.\d+)?)\s*([A-Z]+)?/i;

// New Regex for Multiple Source Assets
const REGEX_MULTI_SOURCE = /([A-Z]+)\s+(?:and|&)\s+([A-Z]+)\s+(?:to|into|for)/i;

// New Regex for Swap and Stake / Zap intents
const REGEX_SWAP_STAKE = /(?:swap\s+and\s+stake|zap\s+(?:into|to)|stake\s+(?:my|after|then)|swap\s+(?:to|into)\s+(?:stake|yield))/i;
const REGEX_STAKE_PROTOCOL = /(?:to\s+)?(aave|compound|yearn|lido|morpho|euler|spark)/i;

// New Regex for direct Stake commands (e.g., "Stake 1 ETH with Lido" or "Stake my ETH")
const REGEX_STAKE_COMMAND = /\b(stake)\b/i;
const REGEX_LIQUID_STAKING_PROVIDER = /\b(lido|rocket\s*pool|rocketpool|stakewise|stake\s*wise)\b/i;

function normalizeNumber(val: string): number {
  val = val.toLowerCase().replace(/[\$,]/g, '');

  if (val.endsWith("k")) {
    return parseFloat(val) * 1000;
  }
  if (val.endsWith("m")) {
    return parseFloat(val) * 1000000;
  }
  return parseFloat(val);
}

export async function parseUserCommand(
  userInput: string,
  conversationHistory: any[] = [],
  inputType: 'text' | 'voice' = 'text'
): Promise<ParseResult> {
  let input = userInput.trim();

  // Pre-processing: Remove fillers
  input = input.replace(/^(hey|hi|hello|please|kindly|can you)\s+/i, '')
               .replace(/\s+(please|kindly|immediately|now|right now)$/i, '')
               .replace(/\b(like)\b/gi, '') // "swap like 100" -> "swap 100"
               .trim();

  // Check for Swap and Stake / Zap Intent
  if (REGEX_SWAP_STAKE.test(input)) {
    const protocolMatch = input.match(REGEX_STAKE_PROTOCOL);
    const stakeProtocol = protocolMatch ? protocolMatch[1].toLowerCase() : null;
    
    let amount: number | null = null;
    let fromAsset: string | null = null;
    let toAsset: string | null = null;
    
    const amtMatch = input.match(/\b(\d+(\.\d+)?)\b/);
    if (amtMatch) {
      amount = parseFloat(amtMatch[1]);
    }
    
    const fromToMatch = input.match(/([A-Z]{2,5})\s+(?:to|into)\s+([A-Z]{2,5})/i);
>>>>>>> 941ae72
    if (fromToMatch) {
      fromAsset = fromToMatch[1].toUpperCase();
      toAsset = fromToMatch[2].toUpperCase();
    }
<<<<<<< HEAD

    if (!fromAsset) {
      const singleAsset = input.match(/\b([A-Z]{2,10})\b/);
      if (singleAsset) fromAsset = singleAsset[1].toUpperCase();
    }

    return {
      ...buildSwapResult(userInput, {
        intent: 'swap_and_stake',
        amount,
        amountType: amount ? 'exact' : null,
        fromAsset,
        toAsset,
        confidence: 80,
        requiresConfirmation: true
      }),
      fromProject: stakeProtocol,
=======
    
    if (!toAsset) {
      toAsset = 'USDC';
    }
    
    return {
      success: true,
      intent: 'swap_and_stake',
      fromAsset,
      fromChain: null,
      toAsset,
      toChain: null,
      amount,
      amountType: amount ? 'exact' : null,
      excludeAmount: undefined,
      excludeToken: undefined,
      quoteAmount: undefined,
      conditions: undefined,
      portfolio: undefined,
      frequency: null,
      dayOfWeek: null,
      dayOfMonth: null,
      settleAsset: null,
      settleNetwork: null,
      settleAmount: null,
      settleAddress: null,
      fromProject: stakeProtocol,
      fromYield: null,
>>>>>>> 941ae72
      toProject: stakeProtocol,
      toYield: null,
      conditionOperator: undefined,
      conditionValue: undefined,
      conditionAsset: undefined,
      targetPrice: undefined,
      condition: undefined,
      confidence: 80,
      validationErrors: [],
      parsedMessage: `Parsed: Swap ${amount || '?'} ${fromAsset || '?'} to ${toAsset} and stake`,
      requiresConfirmation: true,
      originalInput: userInput
     };
  }

<<<<<<< HEAD
  // Enhanced staking command detection and parsing
  if (REGEX_STAKE_COMMAND.test(input) && !REGEX_SWAP_STAKE.test(input)) {
    const providerMatch = input.match(REGEX_LIQUID_STAKING_PROVIDER);
    const stakeProtocol = providerMatch ? providerMatch[1].toLowerCase().replace(/\s+/g, '_') : 'lido';

    let amount: number | null = null;
    let amountType: 'exact' | 'percentage' | 'all' | null = null;
    let stakeAsset: string | null = null;

    // Check for "stake all" patterns
    const allMatch = input.match(REGEX_STAKE_ALL);
    if (allMatch) {
      stakeAsset = allMatch[1].toUpperCase();
      amountType = 'all';
    }

    // Check for percentage patterns
    const percentageMatch = input.match(REGEX_STAKE_PERCENTAGE);
    if (percentageMatch && !allMatch) {
      amount = parseFloat(percentageMatch[1]);
      stakeAsset = percentageMatch[2].toUpperCase();
      amountType = 'percentage';
    }

    // Check for exact amount patterns
    const amountMatch = input.match(REGEX_STAKE_AMOUNT);
    if (amountMatch && !allMatch && !percentageMatch) {
      if (amountMatch[1]) {
        amount = parseScaledNumber(amountMatch[1]);
        amountType = 'exact';
      }
      stakeAsset = amountMatch[2].toUpperCase();
    }

    // Fallback: try to find asset after "stake" keyword
    if (!stakeAsset) {
      const assetMatch = input.match(/stake\s+(?:my\s+)?(?:some\s+)?([A-Z]{2,10})/i);
      if (assetMatch) {
        stakeAsset = assetMatch[1].toUpperCase();
=======
  // Check for direct Stake Intent (e.g., "Stake 1 ETH with Lido" or "Stake my ETH")
  if (REGEX_STAKE_COMMAND.test(input) && !REGEX_SWAP_STAKE.test(input)) {
    const providerMatch = input.match(REGEX_LIQUID_STAKING_PROVIDER);
    const stakeProtocol = providerMatch ? providerMatch[1].toLowerCase().replace(/\s+/g, '_') : 'lido';
    const stakeProvider = providerMatch
      ? providerMatch[1].replace(/\s+/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : 'Lido';

    let amount: number | null = null;
    let stakeAsset: string | null = null;

    const amtMatch = input.match(/\b(\d+(\.\d+)?)\s*([A-Z]{2,5})?\b/i);
    if (amtMatch) {
      amount = parseFloat(amtMatch[1]);
      if (amtMatch[3]) {
        stakeAsset = amtMatch[3].toUpperCase();
      }
    }

    // Try to find asset after "stake" keyword
    if (!stakeAsset) {
      const assetMatch = input.match(/stake\s+(?:my\s+)?(\d+(\.\d+)?\s+)?([A-Z]{2,5})/i);
      if (assetMatch && assetMatch[3]) {
        stakeAsset = assetMatch[3].toUpperCase();
>>>>>>> 941ae72
      }
    }

    // Default to ETH if no asset specified
    if (!stakeAsset) {
      stakeAsset = 'ETH';
    }

<<<<<<< HEAD
    // Enhanced asset to LST mapping with more protocols
    let toAsset = 'stETH';
    let toChain = 'ethereum';
    
    if (stakeAsset === 'ETH') {
      if (stakeProtocol === 'rocket_pool' || stakeProtocol === 'rocketpool') {
        toAsset = 'rETH';
      } else if (stakeProtocol === 'stakewise') {
        toAsset = 'osETH';
      } else {
        toAsset = 'stETH'; // Default to Lido
      }
      toChain = 'ethereum';
    } else if (stakeAsset === 'SOL') {
      toAsset = 'mSOL';
      toChain = 'solana';
    } else if (stakeAsset === 'MATIC') {
      toAsset = 'stMATIC';
      toChain = 'polygon';
    } else if (stakeAsset === 'AVAX') {
      toAsset = 'sAVAX';
      toChain = 'avalanche';
    } else if (stakeAsset === 'BNB') {
      toAsset = 'ankrBNB';
      toChain = 'bsc';
    }

    // Determine confidence based on completeness
    let confidence = 85;
    if (!amount && amountType !== 'all') {
      confidence = 60; // Lower confidence when amount is missing
    }

    const validationErrors: string[] = [];
    if (!amount && amountType !== 'all') {
      validationErrors.push('Amount not specified. How much would you like to stake?');
    }

    return {
      success: true,
      intent: 'swap_and_stake',
      fromAsset: stakeAsset,
      fromChain: stakeAsset === 'SOL' ? 'solana' : 
                 stakeAsset === 'MATIC' ? 'polygon' :
                 stakeAsset === 'AVAX' ? 'avalanche' :
                 stakeAsset === 'BNB' ? 'bsc' : 'ethereum',
      toAsset: toAsset,
      toChain: toChain,
      amount,
      amountType,
=======
    // Estimated APR based on provider
    const stakingApr = stakeProtocol === 'rocket_pool' ? 3.4 :
                       stakeProtocol === 'stakewise' ? 3.3 : 3.5;

    return {
      success: true,
      intent: 'stake',
      fromAsset: stakeAsset,
      fromChain: 'ethereum',
      toAsset: null,
      toChain: null,
      amount,
      amountType: amount ? 'exact' : null,
>>>>>>> 941ae72
      excludeAmount: undefined,
      excludeToken: undefined,
      quoteAmount: undefined,
      conditions: undefined,
      portfolio: undefined,
      frequency: null,
      dayOfWeek: null,
      dayOfMonth: null,
      settleAsset: null,
      settleNetwork: null,
      settleAmount: null,
      settleAddress: null,
      fromProject: stakeProtocol,
      fromYield: null,
      toProject: null,
      toYield: null,
      conditionOperator: undefined,
      conditionValue: undefined,
      conditionAsset: undefined,
      targetPrice: undefined,
      condition: undefined,
<<<<<<< HEAD
      confidence,
      validationErrors,
      parsedMessage: `Parsed: Stake ${amount || amountType || '?'} ${stakeAsset} -> ${toAsset} via ${stakeProtocol}`,
=======
      // Staking specific fields
      stakeAsset,
      stakeProtocol,
      stakeChain: 'ethereum',
      stakingApr,
      stakeProvider,
      confidence: 85,
      validationErrors: [],
      parsedMessage: `Parsed: Stake ${amount || '?'} ${stakeAsset} with ${stakeProvider} (${stakingApr}% APR)`,
>>>>>>> 941ae72
      requiresConfirmation: true,
      originalInput: userInput
    };
  }

<<<<<<< HEAD
  /* ───────────── STANDARD SWAP ───────────── */

  const isLimitOrDca = /\b(if|when|target|below|above|dca|every|daily|weekly|monthly)\b/i.test(input);
  const isSwapRelated = !isLimitOrDca && /\b(swap|convert|send|transfer|buy|sell|move|exchange)\b/i.test(input);

  if (isSwapRelated) {
    if (/\bor\b/i.test(input)) {
      return {
        success: false,
        intent: 'swap',
        validationErrors: ['Command is ambiguous. Please specify clearly.'],
        confidence: 0,
        parsedMessage: 'Ambiguous destination assets detected',
        requiresConfirmation: true,
        originalInput: userInput
      };
    }

    if (REGEX_MULTI_SOURCE.test(input)) {
      return {
        success: false,
        intent: 'swap',
        validationErrors: ['Multiple source assets not supported'],
        confidence: 0,
        parsedMessage: 'Multiple source assets detected',
        requiresConfirmation: false,
        originalInput: userInput
      };
    }

    let confidence = 20;
    let intent: ParsedCommand['intent'] = 'swap';
    let amountType: ParsedCommand['amountType'] = null;
    let amount: number | null = null;
    let fromAsset: string | null = null;
    let toAsset: string | null = null;
    let excludeAmount: number | undefined;
    let excludeToken: string | undefined;
    let quoteAmount: number | undefined;

    const fromToMatch = input.match(REGEX_FROM_TO) || input.match(REGEX_TOKENS);
    if (fromToMatch) {
      fromAsset = fromToMatch[1].toUpperCase();
      toAsset = (fromToMatch[3] ?? fromToMatch[2]).toUpperCase();
      confidence += 35;
    }

    const buyWithMatch = input.match(/\bbuy\s+(\d+(?:\.\d+)?)\s+([A-Z]{2,10})\s+with\s+([A-Z]{2,10})\b/i);
    if (buyWithMatch) {
      amount = parseFloat(buyWithMatch[1]);
      amountType = 'exact';
      toAsset = buyWithMatch[2].toUpperCase();
      fromAsset = buyWithMatch[3].toUpperCase();
      confidence += 35;
    }

    const explicitToMatch = input.match(/\b(?:to|into|for)\s+([A-Z]{2,10})\b/i);
    if (!toAsset && explicitToMatch) {
      toAsset = explicitToMatch[1].toUpperCase();
      confidence += 10;
    }

    const percentageMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:%|percent)/i);
    if (percentageMatch) {
      amount = parseFloat(percentageMatch[1]);
      amountType = 'percentage';
      confidence += 20;
    } else if (/\bhalf\b/i.test(input)) {
      amount = 50;
      amountType = 'percentage';
      confidence += 20;
    }

    if (!fromAsset && amountType === 'percentage') {
      const stopWords = ['SWAP', 'CONVERT', 'SEND', 'TRANSFER', 'BUY', 'SELL', 'MOVE', 'EXCHANGE', 'ALL', 'MAX', 'OF', 'MY', 'PERCENT'];

      const ofAsset = input.match(/(?:of\s+(?:my\s+)?)([A-Z]{2,10})\b/i);
      if (ofAsset) {
        const candidate = ofAsset[1].toUpperCase();
        if (!stopWords.includes(candidate)) fromAsset = candidate;
      }

      if (!fromAsset) {
        const afterPercentAsset = input.match(/(?:%|percent|half)\s+(?:of\s+(?:my\s+)?)?([A-Z]{2,10})\b/i);
        if (afterPercentAsset) {
          const candidate = afterPercentAsset[1].toUpperCase();
          if (!stopWords.includes(candidate)) fromAsset = candidate;
        }
      }

      if (!fromAsset) {
        const tokenCandidates = [...input.toUpperCase().matchAll(/\b([A-Z]{2,10})\b/g)].map((m) => m[1]);
        const filtered = tokenCandidates.filter((t) => !stopWords.includes(t));
        if (filtered.length) fromAsset = filtered[filtered.length - 1];
      }
    }

    const worthSourceMatch = input.match(/\b(?:swap|convert|sell|buy|send|transfer|move|exchange)\s+([A-Z]{2,10})\s+worth\b/i);
    if (!fromAsset && worthSourceMatch) {
      fromAsset = worthSourceMatch[1].toUpperCase();
      confidence += 10;
    }

    const allMatch = /\b(all|everything|max|entire\s+balance|full\s+balance)\b/i.test(input);
    if (allMatch) {
      amountType = 'all';
      amount = null;
      confidence += 20;
    }

    const amtMatch = input.match(REGEX_AMOUNT_TOKEN);
    if (amtMatch && amountType !== 'percentage' && amountType !== 'all' && !/\bworth\b/i.test(input)) {
      amount = parseFloat(amtMatch[1]);
      amountType = 'exact';
      if (!fromAsset) fromAsset = amtMatch[2].toUpperCase();
      confidence += 20;
    }

    if (!fromAsset) {
      const verbAsset = input.match(/\b(?:swap|convert|send|transfer|buy|sell|move|exchange)\s+(?:my\s+)?([A-Z]{2,10})\b/i);
      if (verbAsset) {
        const candidate = verbAsset[1].toUpperCase();
        if (!['ALL','EVERYTHING','MAX','ENTIRE','BALANCE','HALF'].includes(candidate)) fromAsset = candidate;
      }
    }

    const exclusionMatch = input.match(/(?:except|but\s+keep)\s+(\d+(?:\.\d+)?)(?:\s*%|\s+([A-Z]{2,10}))?/i);
    if (exclusionMatch) {
      excludeAmount = parseFloat(exclusionMatch[1]);
      excludeToken = exclusionMatch[2]?.toUpperCase() ?? fromAsset ?? undefined;
    }

    const quoteMatch = input.match(/\bworth\s+(\d+(?:\.\d+)?)\s+([A-Z]{2,10})\b/i);
    if (quoteMatch) {
      quoteAmount = parseFloat(quoteMatch[1]);
      if (!toAsset) toAsset = quoteMatch[2].toUpperCase();
      confidence += 10;
    }

    let conditionOperator: 'gt' | 'lt' | undefined;
    let conditionValue: number | undefined;
    let conditionAsset: string | undefined;

    const conditionPattern = /(if|when|only if)[^\dA-Z$]*([A-Z]{2,10}|price)?[^\d$<>]*(?:is\s+)?(?:goes\s+|rises\s+|drops\s+|hits\s+)?(above|below|>|<|greater than|less than)?\s*\$?(\d+(?:\.\d+)?[km]?)/i;
    const conditionMatch = input.match(conditionPattern);
    if (conditionMatch) {
      const rawAsset = conditionMatch[2];
      const rawOperator = conditionMatch[3];
      const rawValue = conditionMatch[4];

      conditionValue = parseScaledNumber(rawValue);
      if (/(above|>|greater)/i.test(rawOperator ?? '')) conditionOperator = 'gt';
      if (/(below|<|less)/i.test(rawOperator ?? '')) conditionOperator = 'lt';

      if (!conditionOperator) {
        if (/(drops?|below)|</i.test(conditionMatch[0])) conditionOperator = 'lt';
        if (/(rises?|above|hits)|>/i.test(conditionMatch[0])) conditionOperator = 'gt';
      }

      conditionAsset = rawAsset && !/price/i.test(rawAsset) ? rawAsset.toUpperCase() : (fromAsset ?? undefined);

      if (conditionOperator && conditionValue && conditionAsset) {
        confidence += 25;

        const shouldBeLimitOrder = /\bwhen\b/i.test(input) || (/\b(convert|buy)\b/i.test(input) && /\bif\b/i.test(input)) || (/\bswap\b/i.test(input) && /\bwhen\s+price\b/i.test(input)) || (/\bsell\b/i.test(input) && /\b(hits|if|when)\b/i.test(input));
        const sellWithExplicitPairAndConditionAsset = /\bsell\b/i.test(input) && /\b(?:to|into|for)\s+[A-Z]{2,10}\b/i.test(input) && /\bwhen\s+[A-Z]{2,10}\b/i.test(input);
        if (shouldBeLimitOrder && !sellWithExplicitPairAndConditionAsset) {
          intent = 'limit_order';
        }
      }
    }

    if (!fromAsset && amountType === 'all') {
      const allAssetMatch = input.match(/\b(?:all|max)\s+([A-Z]{2,10})\b/i);
      if (allAssetMatch) fromAsset = allAssetMatch[1].toUpperCase();
    }

    if (!fromAsset && !toAsset && !amount && amountType !== 'all') {
      logger.info('Fallback to LLM for:', userInput);
      try {
        const result = await parseWithLLM(userInput, conversationHistory, inputType);
        if (result.intent === 'portfolio' && Array.isArray(result.portfolio) && result.portfolio.length) {
          const total = result.portfolio.reduce((sum, item) => sum + (item.percentage ?? 0), 0);
          if (total !== 100) {
            return {
              ...result,
              success: false,
              validationErrors: [...(result.validationErrors ?? []), `Total allocation is ${total}%, but should be 100%`],
              originalInput: userInput
            };
          }
        }
        if (result.validationErrors?.length) {
          return { ...result, success: false, originalInput: userInput };
        }
        return { ...result, originalInput: userInput };
      } catch (error) {
        logger.error('LLM Error', error);
        return {
          success: false,
          intent: 'unknown',
          confidence: 0,
          validationErrors: ['Parsing failed'],
          parsedMessage: '',
          requiresConfirmation: false,
          originalInput: userInput
        };
      }
    }

    const hasExplicitTo = /\b(?:to|into|for)\s+[A-Z]{2,10}\b/i.test(input);
    if ((!fromAsset && amountType !== 'all') || (!hasExplicitTo && amount === null && amountType === null && !conditionOperator && !quoteAmount) || /^\s*(swap|convert)\s+[A-Z]{2,10}\s*$/i.test(input) || /^\s*convert\s+to\s+[A-Z]{2,10}\s*$/i.test(input)) {
      logger.info('Fallback to LLM for:', userInput);
      try {
        const result = await parseWithLLM(userInput, conversationHistory, inputType);
        if (result.intent === 'portfolio' && Array.isArray(result.portfolio) && result.portfolio.length) {
          const total = result.portfolio.reduce((sum, item) => sum + (item.percentage ?? 0), 0);
          if (total !== 100) {
            return {
              ...result,
              success: false,
              validationErrors: [...(result.validationErrors ?? []), `Total allocation is ${total}%, but should be 100%`],
              originalInput: userInput
            };
          }
        }
        if (result.validationErrors?.length) {
          return { ...result, success: false, originalInput: userInput };
        }
        return { ...result, originalInput: userInput };
      } catch (error) {
        logger.error('LLM Error', error);
        return {
          success: false,
          intent: 'unknown',
          confidence: 0,
          validationErrors: ['Parsing failed'],
          parsedMessage: '',
          requiresConfirmation: false,
          originalInput: userInput
        };
      }
    }

    return buildSwapResult(userInput, {
      intent,
      fromAsset,
      toAsset,
      amount,
      amountType,
      excludeAmount,
      excludeToken,
      quoteAmount,
      conditions: conditionOperator && conditionValue && conditionAsset
        ? {
            type: conditionOperator === 'gt' ? 'price_above' : 'price_below',
            asset: conditionAsset,
            value: conditionValue
          }
        : undefined,
      conditionOperator,
      conditionValue,
      conditionAsset,
      confidence: Math.min(100, confidence)
    });
  }

  /* ───────────── LIMIT ORDER & DCA ───────────── */
  if (isLimitOrDca) {
    // Only treat as DCA if the input clearly indicates recurrence; otherwise,
    // let limit-order parsing handle it later in this branch.
    const hasDcaRecurrenceCue = /\b(every|daily|weekly|monthly|recurring|recurrence|dca)\b/i.test(
      input
    );

    if (hasDcaRecurrenceCue) {
      const dcaConfig = parseDCA(input);
      if (dcaConfig && dcaConfig.amount) {
        return {
          success: true,
          intent: 'dca',
          fromAsset: 'USDC', // Default source for DCA usually
          fromChain: null,
          toAsset: dcaConfig.targetAsset ?? 'BTC', // Default target fallback
          toChain: null,
          amount: dcaConfig.amount ?? null,
          amountType: dcaConfig.amountType ?? 'exact',
          frequency: dcaConfig.frequency || 'daily',
          dayOfWeek:
            dcaConfig.dayOfWeek !== undefined
              ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dcaConfig.dayOfWeek]
              : null,
          dayOfMonth: dcaConfig.dayOfMonth?.toString() || null,
          excludeAmount: undefined,
          excludeToken: undefined,
          quoteAmount: undefined,
          conditions: undefined,
          portfolio: undefined,
          settleAsset: null,
          settleNetwork: null,
          settleAmount: null,
          settleAddress: null,
          fromProject: null,
          fromYield: null,
          toProject: null,
          toYield: null,
          conditionOperator: undefined,
          conditionValue: undefined,
          conditionAsset: undefined,
          targetPrice: undefined,
          condition: undefined,
          confidence: 90,
          validationErrors: [],
          parsedMessage: `Parsed: DCA $${dcaConfig.amount} into ${dcaConfig.targetAsset || 'BTC'} ${dcaConfig.frequency || 'daily'}`,
          requiresConfirmation: true,
          originalInput: userInput
        };
      }
    }

    const limitConfig = detectLimitOrder(input);
    if (limitConfig && limitConfig.price) {
      const tradeAsset = limitConfig.asset ?? 'ETH';
      const quoteAsset = limitConfig.targetAsset ?? (tradeAsset === 'USDC' ? 'ETH' : 'USDC');
      const isBuyBelow = limitConfig.condition === 'below';
      return {
        success: true,
        intent: 'limit_order',
        fromAsset: isBuyBelow ? quoteAsset : tradeAsset,
        fromChain: null,
        toAsset: isBuyBelow ? tradeAsset : quoteAsset,
        toChain: null,
        amount: limitConfig.amount ?? null,
        amountType: limitConfig.amountType ?? null,
        targetPrice: limitConfig.price,
        condition: limitConfig.condition,
        // Map to new condition format
        conditions: {
            type: limitConfig.condition === 'above' ? 'price_above' : 'price_below',
            asset: limitConfig.asset ?? 'ETH',
            value: limitConfig.price
        },
        excludeAmount: undefined,
        excludeToken: undefined,
        quoteAmount: undefined,
        portfolio: undefined,
        frequency: null,
        dayOfWeek: null,
        dayOfMonth: null,
        settleAsset: null,
        settleNetwork: null,
        settleAmount: null,
        settleAddress: null,
        fromProject: null,
        fromYield: null,
        toProject: null,
        toYield: null,
        conditionOperator: limitConfig.condition === 'above' ? 'gt' : 'lt',
        conditionValue: limitConfig.price,
        conditionAsset: limitConfig.asset,
        confidence: 90,
        validationErrors: [],
        parsedMessage: `Parsed: Limit Order - ${limitConfig.condition} $${limitConfig.price}`,
        requiresConfirmation: true,
        originalInput: userInput
      };
    }
  }

  logger.info('Fallback to LLM for:', userInput);
  try {
    const result = await parseWithLLM(userInput, conversationHistory, inputType);
    return { ...result, originalInput: userInput };
  } catch (error) {
    logger.error('LLM Error', error);
    return {
      success: false,
      intent: 'unknown',
      confidence: 0,
      validationErrors: ['Parsing failed'],
      parsedMessage: '',
      requiresConfirmation: false,
      originalInput: userInput
    };
  }
}
=======
  // 1. Check for Swap Intent Keywords
  const isSwapRelated = /\b(swap|convert|send|transfer|buy|sell|move|exchange)\b/i.test(input);

  if (isSwapRelated) {
    let intent: ParsedCommand['intent'] = 'swap';
    let amountType: ParsedCommand['amountType'] = null;
    let amount: number | null = null;
    let excludeAmount: number | undefined;
    let excludeToken: string | undefined;
    let quoteAmount: number | undefined;
    let fromAsset: string | null = null;
    let toAsset: string | null = null;
    let confidence = 0;
    let validationErrors: string[] = [];

    // Boost confidence slightly for explicit swap keywords
    confidence += 10;

    // Limit Order fields
    let conditionOperator: 'gt' | 'lt' | undefined;
    let conditionValue: number | undefined;
    let conditionAsset: string | undefined;
    let conditions: ParsedCommand['conditions'];

    // Check Multi-source
    if (REGEX_MULTI_SOURCE.test(input)) {
        validationErrors.push('Multiple source assets not supported');
        return {
             success: false,
             intent: 'swap',
             fromAsset: null, fromChain: null, toAsset: null, toChain: null, amount: null,
             settleAsset: null, settleNetwork: null, settleAmount: null, settleAddress: null,
             fromProject: null, fromYield: null, toProject: null, toYield: null,
             validationErrors,
             confidence: 0,
             parsedMessage: 'Multiple source assets detected',
             requiresConfirmation: false,
             originalInput: userInput
        };
    }

    // A. Detect Exclusion
    const exclusionMatch = input.match(REGEX_EXCLUSION);
    if (exclusionMatch) {
      amountType = 'all';
      excludeAmount = parseFloat(exclusionMatch[1]);
      if (exclusionMatch[3]) {
        excludeToken = exclusionMatch[3].toUpperCase();
        if (!fromAsset) fromAsset = excludeToken;
      }
      confidence += 40;
    }

    // Attempt to extract token from "all [Token]" if we identified 'all' but missed the token
    if (amountType === 'all' && !fromAsset) {
        const allTokenMatch = input.match(REGEX_ALL_TOKEN);
        if (allTokenMatch) {
             const token = allTokenMatch[2].toUpperCase();
             if (!/^(swap|convert|send|transfer|buy|sell|move|exchange)$/i.test(token)) {
                 fromAsset = token;
             }
        }
    }

    // B. Detect Percentage / Max
    if (amountType !== 'all') { 
      const pctMatch = input.match(REGEX_PERCENTAGE);
      if (pctMatch) {
        amountType = 'percentage';
        amount = parseFloat(pctMatch[1]);
        if (pctMatch[3]) fromAsset = pctMatch[3].toUpperCase();
        confidence += 40;
      } else {
        const halfMatch = input.match(REGEX_HALF);
        if (halfMatch) {
            amountType = 'percentage';
            amount = 50;
            if (halfMatch[2]) fromAsset = halfMatch[2].toUpperCase();
            confidence += 40;
        } else {
            const quarterMatch = input.match(REGEX_QUARTER);
            if (quarterMatch) {
                amountType = 'percentage';
                amount = 25;
                if (quarterMatch[2]) fromAsset = quarterMatch[2].toUpperCase();
                confidence += 40;
            } else if (REGEX_MAX_ALL.test(input)) {
                amountType = 'all';
                const allTokenMatch = input.match(REGEX_ALL_TOKEN);
                if (allTokenMatch) {
                    fromAsset = allTokenMatch[2].toUpperCase();
                }
                confidence += 30;
            }
        }
      }
    }

    // C. Detect Quote Amount ("Worth")
    const quoteMatch = input.match(REGEX_QUOTE);
    if (quoteMatch) {
        if (quoteMatch[1]) {
             const candidate = quoteMatch[1].toUpperCase();
             if (!/^(swap|convert|send|transfer|buy|sell|move|exchange)$/i.test(candidate)) {
                 if (!fromAsset) fromAsset = candidate;
             }
        }
        quoteAmount = parseFloat(quoteMatch[3]);
        if (quoteMatch[5]) {
            if (!toAsset) toAsset = quoteMatch[5].toUpperCase();
        }
        confidence += 30;
    }

    // D. Detect Tokens
    if (!fromAsset || !toAsset) {
        const fromToMatch = input.match(REGEX_FROM_TO);
        if (fromToMatch) {
            fromAsset = fromToMatch[1].toUpperCase();
            toAsset = fromToMatch[2].toUpperCase();
            confidence += 40;
        } else {
            const tokenMatch = input.match(REGEX_TOKENS);
            if (tokenMatch) {
                const token1 = tokenMatch[1].toUpperCase();
                const token2 = tokenMatch[3].toUpperCase();
                const isVerb = /^(swap|convert|send|transfer|buy|sell|move|exchange)$/i.test(token1);

                if (!isVerb) {
                    if (fromAsset && fromAsset !== token1) {
                    } else {
                        fromAsset = token1;
                    }
                    toAsset = token2;
                    confidence += 30;
                }
            }
        }
    }

    // E. Detect Numeric Amount
    if (!amount && amountType === null && !quoteAmount) {
       const amtTokenMatch = input.match(REGEX_AMOUNT_TOKEN);
       if (amtTokenMatch) {
           amount = parseFloat(amtTokenMatch[1]);
           amountType = 'exact';
           if (!fromAsset) fromAsset = amtTokenMatch[3].toUpperCase();
           confidence += 20;
       } else {
           const numMatch = input.match(/\b(\d+(\.\d+)?)\b/);
           if (numMatch) {
               if (amountType !== 'all') { 
                   amount = parseFloat(numMatch[1]);
                   amountType = 'exact';
                   confidence += 10;
               }
           }
       }
    }

    // F. Detect Limit Order Condition
    const conditionMatch = input.match(REGEX_CONDITION);
    if (conditionMatch) {
        intent = 'limit_order';
        const assetStr = conditionMatch[1];
        const operatorStr = conditionMatch[2].toLowerCase();
        const valueStr = conditionMatch[3];

        conditionValue = normalizeNumber(valueStr);

        if (assetStr) {
            const candidate = assetStr.toUpperCase();
            const ignoredWords = ['IS', 'GOES', 'DROPS', 'RISES', 'FALLS', 'THE', 'PRICE', 'OF'];
            if (!ignoredWords.includes(candidate)) {
                conditionAsset = candidate;
            }
        }

        // Logic fix: "drops below" -> lt, "rises above" -> gt
        if (operatorStr.includes('below') || operatorStr.includes('less') || operatorStr.includes('under') || operatorStr.includes('<') || operatorStr.includes('drops') || operatorStr.includes('falls')) {
            conditionOperator = 'lt';
        } else {
            conditionOperator = 'gt';
        }

        if (conditionValue) {
            conditions = {
                type: conditionOperator === 'gt' ? "price_above" : "price_below",
                asset: conditionAsset || fromAsset || 'ETH',
                value: conditionValue
            };
        }

        confidence += 30;
    }

    if (conditionOperator && conditionValue) {
        conditions = {
            type: conditionOperator === 'gt' ? 'price_above' : 'price_below',
            asset: conditionAsset || fromAsset || 'ETH',
            value: conditionValue
        };
    }

    if (confidence >= 30) {
        if ((conditionOperator || conditionValue) && !conditionAsset && fromAsset) {
            conditionAsset = fromAsset;
        }

        if (conditions && !conditions.asset && conditionAsset) {
            conditions.asset = conditionAsset;
        }

        let parsedMessage = `Parsed: ${amountType || amount || (quoteAmount ? 'Value ' + quoteAmount : '?')} ${fromAsset || '?'} -> ${toAsset || '?'}`;
        if (conditionOperator && conditionValue) {
            parsedMessage += ` if ${conditionAsset || fromAsset} ${conditionOperator === 'gt' ? '>' : '<'} ${conditionValue}`;
        }

        return {
            success: true,
            intent: intent,
            fromAsset: fromAsset || null,
            fromChain: null,
            toAsset: toAsset || null,
            toChain: null,
            amount: amount || null,
            amountType: amountType || 'exact',
            excludeAmount,
            excludeToken,
            quoteAmount,
            conditions,
            portfolio: undefined,
            frequency: null, dayOfWeek: null, dayOfMonth: null,
            settleAsset: null, settleNetwork: null, settleAmount: null, settleAddress: null,
            fromProject: null, fromYield: null, toProject: null, toYield: null,

            conditionOperator,
            conditionValue,
            conditionAsset,
            targetPrice: conditionValue,
            condition: conditionOperator === 'gt' ? 'above' : 'below',

            confidence: Math.min(100, confidence + 30),
            validationErrors: [],
            parsedMessage,
            requiresConfirmation: false,
            originalInput: userInput
        };
    }
  }

  // 2. Fallback to LLM
  logger.info("Fallback to LLM for:", userInput);
  try {
    const result = await parseWithLLM(userInput, conversationHistory, inputType);

    if (!result.conditions) {
        const text = userInput.toLowerCase();
        const aboveMatch = text.match(/above\s+(\d+(?:k|m)?)/i);
        const belowMatch = text.match(/below\s+(\d+(?:k|m)?)/i);

        if (aboveMatch) {
            result.conditions = {
                type: "price_above",
                asset: result.toAsset || result.fromAsset || 'ETH',
                value: normalizeNumber(aboveMatch[1])
            };
        } else if (belowMatch) {
             result.conditions = {
                type: "price_below",
                asset: result.toAsset || result.fromAsset || 'ETH',
                value: normalizeNumber(belowMatch[1])
            };
        }
    }

    if (userInput.includes("%")) {
       result.amountType = "percentage";
    }

    return {
      ...result,
      amountType: result.amountType || null,
      excludeAmount: result.excludeAmount || undefined,
      excludeToken: result.excludeToken || undefined,
      quoteAmount: result.quoteAmount || undefined,
      conditions: result.conditions || undefined,
      originalInput: userInput
    };
  } catch (error) {
     logger.error("LLM Error", error);
     return {
        success: false,
        intent: 'unknown',
        confidence: 0,
        validationErrors: ['Parsing failed'],
        parsedMessage: '',
        fromAsset: null, fromChain: null, toAsset: null, toChain: null, amount: null,
        settleAsset: null, settleNetwork: null, settleAmount: null, settleAddress: null,
        fromProject: null, fromYield: null, toProject: null, toYield: null,
        requiresConfirmation: false,
        originalInput: userInput
     };
  }
}
>>>>>>> 941ae72
