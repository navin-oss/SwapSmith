import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/database';
<<<<<<< HEAD
import { verifyAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    // Verify Firebase authentication token (optional for leaderboard viewing)
    const authResult = await verifyAuth(request);
    const userId = authResult.success ? authResult.userId : undefined;

=======

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
>>>>>>> 941ae72
    const leaderboard = await getLeaderboard(100);

    // Mark current user if authenticated
    const enrichedLeaderboard = leaderboard.map(entry => ({
      ...entry,
      userName: (entry.walletAddress && typeof entry.walletAddress === 'string')
        ? `${entry.walletAddress.slice(0, 6)}...${entry.walletAddress.slice(-4)}` 
        : `User ${entry.userId}`,
<<<<<<< HEAD
      isCurrentUser: userId ? entry.userId === userId : false,
=======
      isCurrentUser: userId ? entry.userId === parseInt(userId) : false,
>>>>>>> 941ae72
    }));

    return NextResponse.json(enrichedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
