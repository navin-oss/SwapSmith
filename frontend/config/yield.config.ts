export const yieldConfig = {
  chains: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base", "Avalanche"],
<<<<<<< HEAD
  assets: ["USDC", "USDT", "DAI", "ETH", "WBTC", "stETH", "rETH", "cbETH"],
  stakingAssets: ["ETH", "stETH", "rETH", "cbETH", "USDC", "USDT", "DAI"],
=======
  assets: ["USDC", "USDT", "DAI"],
>>>>>>> 941ae72
} as const;

export type Chain = typeof yieldConfig.chains[number];
export type Asset = typeof yieldConfig.assets[number];
<<<<<<< HEAD
export type StakingAsset = typeof yieldConfig.stakingAssets[number];

// Supported liquid staking protocols
export const stakingProtocols = {
  lido: { name: 'Lido', token: 'stETH', chain: 'Ethereum' },
  rocketpool: { name: 'Rocket Pool', token: 'rETH', chain: 'Ethereum' },
  coinbase: { name: 'Coinbase Wrapped Staked ETH', token: 'cbETH', chain: 'Ethereum' },
  aave: { name: 'Aave V3', token: 'aETH', chain: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'] },
  compound: { name: 'Compound V3', token: 'cETH', chain: ['Ethereum', 'Arbitrum', 'Base'] },
} as const;
=======
>>>>>>> 941ae72
