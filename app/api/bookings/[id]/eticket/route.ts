import { NextRequest, NextResponse } from 'next/server';
import { getBooking, generateETicket } from '../../../../lib/bookingService';

// GET /api/bookings/[id]/eticket - Generate an e-ticket for a booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const booking = getBooking(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking is confirmed
    if (booking.status !== 'confirmed' && booking.status !== 'completed') {
      return NextResponse.json(
        { error: 'E-ticket can only be generated for confirmed bookings' },
        { status: 400 }
      );
    }

    // In a real implementation, this would generate a PDF and return it
    // For this mock implementation, we'll just return a JSON response
    // that would represent the e-ticket data
    
    const ticketData = {
      bookingId: booking.id,
      bookingReference: booking.id.substring(0, 8).toUpperCase(),
      issueDate: new Date().toISOString(),
      flightInfo: {
        airline: booking.airline,
        flightNumber: booking.flightNumber,
        origin: booking.origin,
        destination: booking.destination,
        departureDate: booking.departureDate,
        departureTime: booking.departureTime,
        arrivalTime: booking.arrivalTime,
        cabinClass: booking.cabinClass
      },
      passengers: booking.passengers.map(p => ({
        name: `${p.firstName} ${p.lastName}`,
        seat: booking.seatAssignments?.[p.id] || 'To be assigned',
      })),
      ticketUrl: `/api/bookings/${bookingId}/eticket/download`, // Would link to PDF download
      termsAndConditions: 'Standard terms and conditions apply.'
    };

    return NextResponse.json(ticketData);
  } catch (error) {
    console.error('Error generating e-ticket:', error);
    return NextResponse.json(
      { error: 'Failed to generate e-ticket' },
      { status: 500 }
    );
  }
} 