import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { SIDESHIFT_CONFIG } from '../../../../shared/config/sideshift';

const API_KEY = process.env.SIDESHIFT_API_KEY;

/**
 * GET /api/orders/[id]
 * Server-side proxy for fetching SideShift order status
 * Polled by the frontend to update swap status in real-time
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      );
    }

    // Get user IP from headers
    const userIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   '127.0.0.1';

    // Make request to SideShift API
    const response = await axios.get(
      `${SIDESHIFT_CONFIG.BASE_URL}/shifts/${id}`,
      {
        headers: {
          'Accept': 'application/json',
          'x-sideshift-secret': API_KEY,
          'x-user-ip': userIP,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: { message?: string } }; status?: number }; message?: string };
    console.error('[SideShift Order Status API Error]', err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.error?.message || 'Failed to fetch order status' },
      { status: err.response?.status || 500 }
    );
  }
}
