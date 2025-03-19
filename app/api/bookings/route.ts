import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getBookingsByEmail } from '../../lib/bookingService';
import { Passenger } from '../../lib/types';

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      flightId,
      flightNumber,
      airline,
      origin,
      destination,
      departureDate,
      departureTime,
      arrivalTime,
      passengers,
      cabinClass,
      totalAmount,
      paymentMethod,
      returnFlightDetails,
    } = body;

    // Validate required fields
    if (!flightId || !flightNumber || !airline || !origin || !destination || 
        !departureDate || !departureTime || !arrivalTime || !passengers || 
        !cabinClass || !totalAmount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate passengers
    if (!Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json(
        { error: 'At least one passenger is required' },
        { status: 400 }
      );
    }

    for (const passenger of passengers) {
      if (!passenger.firstName || !passenger.lastName || !passenger.email) {
        return NextResponse.json(
          { error: 'Each passenger must have firstName, lastName, and email' },
          { status: 400 }
        );
      }
    }

    // Create the booking
    const newBooking = createBooking(
      flightId,
      flightNumber,
      airline,
      origin,
      destination,
      departureDate,
      departureTime,
      arrivalTime,
      passengers as Passenger[],
      cabinClass,
      totalAmount,
      paymentMethod,
      returnFlightDetails
    );

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Get bookings for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const bookings = getBookingsByEmail(email);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
} 