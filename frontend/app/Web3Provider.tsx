'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, avalanche, optimism, bsc, base, sepolia, solana, cosmosHub } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
    },
  },
})

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '3fcc6b1496c0293409106f90117d3361';

const supportedChains = [
  mainnet, 
  polygon, 
  arbitrum, 
  avalanche, 
  optimism, 
  bsc, 
  base,
  sepolia,
  solana,
  cosmosHub
] as const;

const config = createConfig({
  chains: supportedChains,
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [optimism.id]: http(),
    [bsc.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [solana.id]: http(),
    [cosmosHub.id]: http(),
  },
  ssr: true,
})

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}