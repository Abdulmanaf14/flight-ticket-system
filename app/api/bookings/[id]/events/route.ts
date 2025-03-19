import { NextRequest } from 'next/server';
import { getBooking, getFlightStatus, subscribeToBookingUpdates } from '../../../../lib/bookingService';
import { BookingUpdateEvent } from '../../../../lib/types';

// This is a special route handler for SSE (Server-Sent Events)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookingId = params.id;
  
  // Verify booking exists
  const booking = getBooking(bookingId);
  if (!booking) {
    return new Response(
      JSON.stringify({ error: 'Booking not found' }), 
      { 
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  // Create a new ReadableStream to send events
  const stream = new ReadableStream({
    start(controller) {
      // Send initial flight status
      const flightStatus = getFlightStatus(booking.flightId);
      if (flightStatus) {
        const event: BookingUpdateEvent = {
          type: 'flight_update',
          bookingId,
          message: `Flight status: ${flightStatus.status}`,
          timestamp: new Date().toISOString(),
          details: { flightStatus }
        };
        
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      }

      // If there's a return flight, send its status too
      if (booking.returnFlightId) {
        const returnFlightStatus = getFlightStatus(booking.returnFlightId);
        if (returnFlightStatus) {
          const event: BookingUpdateEvent = {
            type: 'flight_update',
            bookingId,
            message: `Return flight status: ${returnFlightStatus.status}`,
            timestamp: new Date().toISOString(),
            details: { flightStatus: returnFlightStatus, isReturnFlight: true }
          };
          
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(new TextEncoder().encode(data));
        }
      }

      // In a real implementation, we would subscribe to database changes
      // For this mock, we'll simulate updates at random intervals
      let isStreamClosed = false;
      
      // Function to send a simulated update
      const sendUpdate = () => {
        if (isStreamClosed) return;
        
        // Simulate flight status changes
        const updateTypes: BookingUpdateEvent['type'][] = [
          'flight_update', 'gate_change', 'delay', 'status_change'
        ];
        const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
        
        let message = '';
        const details: Record<string, any> = {};
        
        switch (randomType) {
          case 'flight_update':
            message = 'Flight status updated to boarding';
            details.status = 'boarding';
            break;
          case 'gate_change':
            const newGate = `G${Math.floor(Math.random() * 30 + 1)}`;
            message = `Gate changed to ${newGate}`;
            details.gate = newGate;
            break;
          case 'delay':
            const delayMinutes = Math.floor(Math.random() * 45 + 15);
            message = `Flight delayed by ${delayMinutes} minutes`;
            details.delayMinutes = delayMinutes;
            break;
          case 'status_change':
            message = 'Check-in now available';
            details.checkInStatus = 'available';
            break;
        }
        
        const event: BookingUpdateEvent = {
          type: randomType,
          bookingId,
          message,
          timestamp: new Date().toISOString(),
          details
        };
        
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
        
        // Schedule next update (between 5-15 seconds in a real app this would be triggered by actual events)
        const nextUpdate = Math.floor(Math.random() * 10000 + 5000);
        setTimeout(sendUpdate, nextUpdate);
      };
      
      // Start sending updates
      setTimeout(sendUpdate, 3000);
      
      // Handle connection close
      request.signal.addEventListener('abort', () => {
        isStreamClosed = true;
      });
    }
  });

  // Return the stream as an SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
} 