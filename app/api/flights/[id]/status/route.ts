import { NextRequest, NextResponse } from 'next/server';
import { getFlightStatus } from '../../../../lib/bookingService';

// GET /api/flights/[id]/status - Get the status of a specific flight
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const flightId = params.id;
    const status = getFlightStatus(flightId);

    if (!status) {
      return NextResponse.json(
        { error: 'Flight status not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching flight status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flight status' },
      { status: 500 }
    );
  }
} 