import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc, and, or } from 'drizzle-orm';
import { 
  swapHistory, 
  dcaSchedules, 
  limitOrders, 
  users 
} from '@/shared/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

/**
 * GET /api/user/swap-history/export
 * Exports transaction history (Swaps, DCA, Limit Orders) as CSV or JSON
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const firebaseUid = decodedToken.uid;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    // 2. Get internal user ID (for DCA/Limit orders which use bigint telegramId or potentially user table ID)
    // Most bot tables use telegramId, but for web users we often map them.
    const userResult = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid)).limit(1);
    const user = userResult[0];
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 3. Fetch data from all sources
    
    // A. Regular Swaps
    const swaps = await db.select().from(swapHistory)
      .where(eq(swapHistory.userId, firebaseUid))
      .orderBy(desc(swapHistory.createdAt));

    // B. DCA Orders (associated via telegramId or potentially other fields)
    // If the user has a telegramId, we fetch those.
    let dcaItems: any[] = [];
    let limitItems: any[] = [];

    if (user.telegramId) {
      dcaItems = await db.select().from(dcaSchedules)
        .where(eq(dcaSchedules.telegramId, user.telegramId))
        .orderBy(desc(dcaSchedules.createdAt));

      limitItems = await db.select().from(limitOrders)
        .where(eq(limitOrders.telegramId, user.telegramId))
        .orderBy(desc(limitOrders.createdAt));
    }

    // 4. Combine and format data
    const allTransactions = [
      ...swaps.map(s => ({
        type: 'Swap',
        date: s.createdAt,
        fromAsset: s.fromAsset,
        fromNetwork: s.fromNetwork,
        fromAmount: s.fromAmount,
        toAsset: s.toAsset,
        toNetwork: s.toNetwork,
        settleAmount: s.settleAmount,
        status: s.status,
        orderId: s.sideshiftOrderId,
        txHash: s.txHash || ''
      })),
      ...dcaItems.map(d => ({
        type: 'DCA',
        date: d.createdAt,
        fromAsset: d.fromAsset,
        fromNetwork: d.fromNetwork,
        fromAmount: d.amountPerOrder,
        toAsset: d.toAsset,
        toNetwork: d.toNetwork,
        settleAmount: 'N/A', // DCA is a schedule
        status: d.isActive ? 'Active' : 'Completed/Inactive',
        orderId: `DCA-${d.id}`,
        txHash: ''
      })),
      ...limitItems.map(l => ({
        type: 'Limit Order',
        date: l.createdAt,
        fromAsset: l.fromAsset,
        fromNetwork: l.fromNetwork,
        fromAmount: l.fromAmount,
        toAsset: l.toAsset,
        toNetwork: l.toNetwork,
        settleAmount: l.settleAmount || 'N/A',
        status: l.status,
        orderId: l.sideshiftOrderId || `LIMIT-${l.id}`,
        txHash: ''
      }))
    ].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    // 5. Return as requested format
    if (format === 'json') {
      return NextResponse.json(allTransactions);
    }

    // Default: CSV
    const headers = ['Type', 'Date', 'From Asset', 'From Network', 'From Amount', 'To Asset', 'To Network', 'Settle Amount', 'Status', 'Order ID', 'Tx Hash'];
    const csvRows = [
      headers.join(','),
      ...allTransactions.map(t => [
        t.type,
        t.date ? new Date(t.date).toISOString() : '',
        t.fromAsset,
        t.fromNetwork,
        t.fromAmount,
        t.toAsset,
        t.toNetwork,
        t.settleAmount,
        t.status,
        t.orderId,
        t.txHash
      ].map(val => `"${val}"`).join(','))
    ];

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="swapsmith-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export history' }, { status: 500 });
  }
}
