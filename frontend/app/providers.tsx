'use client'

<<<<<<< HEAD
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { initializeRewards } from '@/lib/rewards-service'
import { useAuth } from '@/hooks/useAuth'
import GlobalPromoAdProvider from '@/components/GlobalPromoAdProvider'
import dynamic from 'next/dynamic'
import { usePageTracking } from '@/hooks/usePageTracking'

// Dynamically import heavy Web3 libraries
const Web3Provider = dynamic(
  () => import('./Web3Provider'),
  { 
    ssr: false,
    loading: () => <div className="min-h-screen bg-gray-900" />
  }
)

/**
 * Component to track page visits on every route change
 */
function PageTrackingInitializer() {
  usePageTracking()
  return null
}
=======
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, avalanche, optimism, bsc, base, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useEffect } from 'react'
import { initializeRewards } from '@/lib/rewards-service'
import { useAuth } from '@/hooks/useAuth'
import GlobalPromoAdProvider from '@/components/GlobalPromoAdProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
    },
  },
})

const supportedChains = [
  mainnet, 
  polygon, 
  arbitrum, 
  avalanche, 
  optimism, 
  bsc, 
  base,
  sepolia,
] as const;

const config = createConfig({
  chains: supportedChains,
  connectors: [
    injected(),
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
  },
  ssr: true,
})
>>>>>>> 941ae72

/**
 * Component to track daily login rewards
 */
function RewardsInitializer() {
<<<<<<< HEAD
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      initializeRewards()
    }
  }, [user])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [shouldLoadWeb3, setShouldLoadWeb3] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadWeb3(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      {shouldLoadWeb3 ? (
        <Web3Provider>
          <PageTrackingInitializer />
          <RewardsInitializer />
          <GlobalPromoAdProvider />
          {children}
        </Web3Provider>
      ) : (
        <>
          <PageTrackingInitializer />
          <GlobalPromoAdProvider />
          {children}
        </>
      )}
=======
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Initialize daily login tracking when user is authenticated
      initializeRewards();
    }
  }, [user]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RewardsInitializer />
          <GlobalPromoAdProvider />
          {children}
        </QueryClientProvider>
      </WagmiProvider>
>>>>>>> 941ae72
    </ThemeProvider>
  )
}