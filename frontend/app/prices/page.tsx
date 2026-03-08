'use client'

import { useState, useEffect, useMemo } from 'react';
import { AlertCircle, RefreshCw, TrendingUp, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CoinCard from '@/components/CoinCard';
import SearchBar from '@/components/SearchBar';
import CoinCardSkeleton from '@/components/CoinCardSkeleton';
import Navbar from '@/components/Navbar';
import TopCryptoSection from '@/components/TopCryptoSection';
import { getCoinPrices, CoinPrice } from '@/utils/sideshift-client';
import Footer from '@/components/Footer'
import FullPageAd from '@/components/FullPageAd'
import { usePricesFullPageAd } from '@/hooks/useAds';

export default function PricesPage() {
  const { showAd, dismiss: dismissAd } = usePricesFullPageAd()
  const [coins, setCoins] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'symbol' | 'change'>('name');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPrices = async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setLoading(true);
      setError(null);

      const prices = await getCoinPrices();
      setCoins(prices);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cryptocurrency prices');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchPrices(); }, []);

  useEffect(() => {
    const interval = setInterval(() => { fetchPrices(true); }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredAndSortedCoins = useMemo(() => {
    let filtered = coins;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = coins.filter(coin =>
        coin.name.toLowerCase().includes(query) ||
        coin.coin.toLowerCase().includes(query) ||
        coin.network.toLowerCase().includes(query)
      );
    }
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'symbol': return a.coin.localeCompare(b.symbol || b.coin);
        case 'price': return parseFloat(b.usdPrice || '0') - parseFloat(a.usdPrice || '0');
        case 'change': return (b.usd_24h_change || 0) - (a.usd_24h_change || 0);
        default: return 0;
      }
    });
  }, [coins, searchQuery, sortBy]);

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const diff = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastUpdated.toLocaleTimeString();
  };

  return (
    <>
      {showAd && <FullPageAd variant="features" duration={10000} onDismiss={dismissAd} />}
      <Navbar />
      <div className="min-h-screen bg-primary pt-24 sm:pt-32 pb-20 transition-colors duration-500">
        
        {/* Ambient Decorative Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[5%] right-[5%] w-[30%] h-[30%] rounded-full bg-ambient-blue blur-[120px] opacity-20 dark:opacity-10" />
          <div className="absolute bottom-[10%] left-[5%] w-[25%] h-[25%] rounded-full bg-ambient-cyan blur-[120px] opacity-10" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-accent-primary mb-1">
                <Activity className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Live Market Data</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-primary tracking-tighter leading-none">
                CRYPTO <span className="text-accent-primary">PRICES</span>
              </h1>
              <p className="text-muted font-medium max-w-lg">
                Real-time data feeds from multiple networks and liquidity providers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-section p-1.5 rounded-2xl border border-primary">
                {(['name', 'price', 'change'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      sortBy === option 
                        ? 'bg-accent-primary text-primary shadow-lg shadow-blue-500/20' 
                        : 'text-muted hover:text-primary'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                onClick={() => fetchPrices(true)}
                disabled={isRefreshing}
                className="p-3 bg-section hover:bg-section-hover rounded-2xl border border-primary transition-all text-muted hover:text-accent-primary disabled:opacity-50"
                title="Refresh prices"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <TopCryptoSection coins={coins.slice(0, 4)} />

          <div className="mb-12">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search assets by name, symbol, or network..."
              className="max-w-2xl"
            />
            {lastUpdated && (
              <p className="mt-4 text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Updated {formatLastUpdated()}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => <CoinCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="glass rounded-[2.5rem] p-12 border-error/20 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-error/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-error" />
              </div>
              <h3 className="text-2xl font-black text-primary mb-3 uppercase tracking-tighter">Connection Interrupted</h3>
              <p className="text-muted font-medium mb-8 leading-relaxed">{error}</p>
              <button
                onClick={() => fetchPrices()}
                className="btn-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
              >
                Reconnect to Feed
              </button>
            </div>
          ) : filteredAndSortedCoins.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredAndSortedCoins.map((coin) => (
                  <motion.div
                    key={`${coin.coin}-${coin.network}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CoinCard {...coin} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="glass rounded-[2.5rem] p-12 text-center border-primary max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-section rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Activity className="w-10 h-10 text-muted opacity-30" />
              </div>
              <h3 className="text-2xl font-black text-primary mb-3 uppercase tracking-tighter">No Assets Found</h3>
              <p className="text-muted font-medium mb-8 leading-relaxed">
                We couldn&apos;t find any assets matching &quot;{searchQuery}&quot;. Try a different search term.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-accent-primary font-black uppercase tracking-widest text-xs hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
