<<<<<<< HEAD
'use client';

import Navbar from '@/components/Navbar';
import WatchlistContainer from '@/components/watchlist/WatchlistContainer';
import Footer from '@/components/Footer';

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))]">
      <Navbar />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <WatchlistContainer />
        </div>
      </main>
      <Footer />
=======
import Watchlist from '@/components/Watchlist';

export const metadata = {
  title: 'Watchlist | SwapSmith',
  description: 'Track your favorite tokens and monitor prices in real-time',
};

export default function WatchlistPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <Watchlist />
      </div>
>>>>>>> 941ae72
    </div>
  );
}
