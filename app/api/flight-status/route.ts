import { NextRequest, NextResponse } from 'next/server';

// Flight status types
export type FlightStatus = 'on-time' | 'delayed' | 'boarding' | 'in-air' | 'landed' | 'cancelled';

// Flight status update structure
interface FlightStatusUpdate {
  flight_number: string;
  status: FlightStatus;
  message: string;
  timestamp: string;
  delay_minutes?: number;
}

// Mock flight data
const flights = {
  'SV123': { 
    baseStatus: 'on-time' as FlightStatus,
    possibleUpdates: ['boarding', 'delayed', 'in-air', 'landed'] 
  },
  'SV456': { 
    baseStatus: 'on-time' as FlightStatus,
    possibleUpdates: ['delayed', 'boarding', 'cancelled'] 
  }
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const flightNumber = url.searchParams.get('flight');
  
  // Set headers for SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  const encoder = new TextEncoder();
  
  // Create a ReadableStream
  const stream = new ReadableStream({
    start: async (controller) => {
      // Initial status
      let currentIndex = 0;
      
      // Send initial status
      let initialStatus: FlightStatusUpdate = {
        flight_number: flightNumber || 'unknown',
        status: flightNumber ? flights[flightNumber as keyof typeof flights]?.baseStatus || 'on-time' : 'on-time',
        message: 'Flight is currently on schedule',
        timestamp: new Date().toISOString()
      };
      
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialStatus)}\n\n`));
      
      // Function to simulate status updates
      const sendUpdate = () => {
        if (!flightNumber || !flights[flightNumber as keyof typeof flights]) {
          return;
        }
        
        const flightData = flights[flightNumber as keyof typeof flights];
        const updates = flightData.possibleUpdates;
        
        // Simulate a status update
        if (updates.length > 0) {
          currentIndex = (currentIndex + 1) % updates.length;
          const newStatus = updates[currentIndex];
          
          const update: FlightStatusUpdate = {
            flight_number: flightNumber,
            status: newStatus as FlightStatus,
            message: getStatusMessage(newStatus as FlightStatus),
            timestamp: new Date().toISOString(),
            delay_minutes: newStatus === 'delayed' ? Math.floor(Math.random() * 120) + 15 : undefined
          };
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
        }
      };
      
      // Send updates every few seconds
      const interval = setInterval(sendUpdate, 8000);
      
      // Clean up if the client disconnects
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });
  
  return new NextResponse(stream, { headers });
}

// Helper function to get a human-readable message for each status
function getStatusMessage(status: FlightStatus): string {
  switch (status) {
    case 'on-time':
      return 'Flight is on schedule';
    case 'delayed':
      return 'Flight is experiencing a delay';
    case 'boarding':
      return 'Boarding has started';
    case 'in-air':
      return 'Flight has departed and is in the air';
    case 'landed':
      return 'Flight has landed at its destination';
    case 'cancelled':
      return 'Flight has been cancelled';
    default:
      return 'Status information unavailable';
  }
} 