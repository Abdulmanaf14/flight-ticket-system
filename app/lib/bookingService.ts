import { v4 as uuidv4 } from 'uuid';
import { Booking, Passenger, FlightStatus, BookingUpdateEvent } from './types';

// Mock database for bookings
let bookings: Booking[] = [];
let flightStatuses: Record<string, FlightStatus> = {};
let eventListeners: Record<string, ((event: BookingUpdateEvent) => void)[]> = {};

// Initialize with some sample data
const initMockData = () => {
  // This would be loaded from a database in a real application
  if (bookings.length === 0) {
    // We'll populate this dynamically as bookings are created
  }
};

// Generate a random flight status
const generateFlightStatus = (flightId: string, flightNumber: string): FlightStatus => {
  const statuses: FlightStatus['status'][] = [
    'scheduled', 'on_time', 'delayed', 'boarding', 'departed', 'arrived'
  ];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    flightId,
    flightNumber,
    status,
    departureGate: `G${Math.floor(Math.random() * 30 + 1)}`,
    arrivalGate: `G${Math.floor(Math.random() * 30 + 1)}`,
    departureTerminal: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
    arrivalTerminal: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
    delayMinutes: status === 'delayed' ? Math.floor(Math.random() * 120 + 15) : 0,
    updatedAt: new Date().toISOString()
  };
};

// Create a new booking
export const createBooking = (
  flightId: string,
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  departureDate: string,
  departureTime: string,
  arrivalTime: string,
  passengers: Passenger[],
  cabinClass: string,
  totalAmount: number,
  paymentMethod: string,
  returnFlightDetails?: {
    flightId: string;
    flightNumber: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
  }
): Booking => {
  const now = new Date().toISOString();
  
  // Create passenger IDs if they don't have them
  const passengersWithIds = passengers.map(passenger => ({
    ...passenger,
    id: passenger.id || uuidv4()
  }));
  
  const newBooking: Booking = {
    id: uuidv4(),
    status: 'confirmed',
    flightId,
    flightNumber,
    airline,
    origin,
    destination,
    departureDate,
    departureTime,
    arrivalTime,
    returnFlightId: returnFlightDetails?.flightId,
    returnFlightNumber: returnFlightDetails?.flightNumber,
    returnDepartureDate: returnFlightDetails?.departureDate,
    returnDepartureTime: returnFlightDetails?.departureTime,
    returnArrivalTime: returnFlightDetails?.arrivalTime,
    passengers: passengersWithIds,
    cabinClass,
    totalAmount,
    paymentMethod,
    createdAt: now,
    updatedAt: now,
    checkInStatus: 'not_available'
  };
  
  bookings.push(newBooking);
  
  // Generate initial flight status
  if (!flightStatuses[flightId]) {
    flightStatuses[flightId] = generateFlightStatus(flightId, flightNumber);
  }
  
  if (returnFlightDetails?.flightId && !flightStatuses[returnFlightDetails.flightId]) {
    flightStatuses[returnFlightDetails.flightId] = generateFlightStatus(
      returnFlightDetails.flightId, 
      returnFlightDetails.flightNumber
    );
  }
  
  // Emit event for new booking
  emitBookingEvent({
    type: 'status_change',
    bookingId: newBooking.id,
    message: 'Booking confirmed',
    timestamp: now
  });
  
  // Simulate sending a confirmation email
  sendBookingConfirmationEmail(newBooking);
  
  return newBooking;
};

// Get a booking by ID
export const getBooking = (id: string): Booking | undefined => {
  return bookings.find(booking => booking.id === id);
};

// Get all bookings for a user by email
export const getBookingsByEmail = (email: string): Booking[] => {
  return bookings.filter(booking => 
    booking.passengers.some(passenger => passenger.email === email)
  );
};

// Update booking details
export const updateBooking = (id: string, updates: Partial<Booking>): Booking | undefined => {
  const index = bookings.findIndex(booking => booking.id === id);
  
  if (index === -1) return undefined;
  
  // Don't allow updating certain fields
  const { id: _, createdAt, ...allowedUpdates } = updates;
  
  const updatedBooking = {
    ...bookings[index],
    ...allowedUpdates,
    updatedAt: new Date().toISOString()
  };
  
  bookings[index] = updatedBooking;
  
  // Emit event for booking update
  emitBookingEvent({
    type: 'status_change',
    bookingId: updatedBooking.id,
    message: 'Booking details updated',
    timestamp: new Date().toISOString()
  });
  
  return updatedBooking;
};

// Cancel a booking
export const cancelBooking = (id: string): Booking | undefined => {
  const booking = getBooking(id);
  
  if (!booking) return undefined;
  
  const updatedBooking = updateBooking(id, { status: 'cancelled' });
  
  if (updatedBooking) {
    // Emit event for booking cancellation
    emitBookingEvent({
      type: 'status_change',
      bookingId: updatedBooking.id,
      message: 'Booking cancelled',
      timestamp: new Date().toISOString()
    });
    
    // Simulate sending a cancellation email
    sendBookingCancellationEmail(updatedBooking);
  }
  
  return updatedBooking;
};

// Complete check-in for booking
export const checkInBooking = (
  bookingId: string, 
  seatAssignments: Record<string, string>
): Booking | undefined => {
  const booking = getBooking(bookingId);
  
  if (!booking) return undefined;
  
  const updatedBooking = updateBooking(bookingId, { 
    checkInStatus: 'completed',
    seatAssignments
  });
  
  if (updatedBooking) {
    // Emit event for check-in completion
    emitBookingEvent({
      type: 'check_in',
      bookingId: updatedBooking.id,
      message: 'Check-in completed',
      timestamp: new Date().toISOString(),
      details: { seatAssignments }
    });
    
    // Simulate sending a check-in confirmation email
    sendCheckInConfirmationEmail(updatedBooking);
  }
  
  return updatedBooking;
};

// Get flight status
export const getFlightStatus = (flightId: string): FlightStatus | undefined => {
  return flightStatuses[flightId];
};

// Update flight status (would typically be called by an admin or system process)
export const updateFlightStatus = (flightId: string, updates: Partial<FlightStatus>): FlightStatus | undefined => {
  if (!flightStatuses[flightId]) return undefined;
  
  flightStatuses[flightId] = {
    ...flightStatuses[flightId],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Find all bookings for this flight and emit events
  const affectedBookings = bookings.filter(
    booking => booking.flightId === flightId || booking.returnFlightId === flightId
  );
  
  affectedBookings.forEach(booking => {
    let eventType: BookingUpdateEvent['type'] = 'flight_update';
    let message = 'Flight status updated';
    
    // More specific events based on what changed
    if (updates.status === 'delayed') {
      eventType = 'delay';
      message = `Flight ${flightStatuses[flightId].flightNumber} delayed by ${flightStatuses[flightId].delayMinutes} minutes`;
    } else if (updates.departureGate || updates.arrivalGate) {
      eventType = 'gate_change';
      message = `Gate changed for flight ${flightStatuses[flightId].flightNumber}`;
    }
    
    emitBookingEvent({
      type: eventType,
      bookingId: booking.id,
      message,
      timestamp: new Date().toISOString(),
      details: { flightStatus: flightStatuses[flightId] }
    });
    
    // Send email notification about the update
    sendFlightStatusUpdateEmail(booking, flightStatuses[flightId]);
  });
  
  return flightStatuses[flightId];
};

// Generate e-ticket PDF (mock function)
export const generateETicket = (bookingId: string): string => {
  const booking = getBooking(bookingId);
  
  if (!booking) {
    throw new Error('Booking not found');
  }
  
  // In a real implementation, this would generate a PDF
  // For this demo, we'll just return a mock URL
  return `/api/bookings/${bookingId}/eticket`;
};

// Email notification functions (mock implementations)
const sendBookingConfirmationEmail = (booking: Booking) => {
  console.log(`Sending booking confirmation email for booking ${booking.id}`);
  // In a real implementation, this would send an actual email
};

const sendBookingCancellationEmail = (booking: Booking) => {
  console.log(`Sending booking cancellation email for booking ${booking.id}`);
  // In a real implementation, this would send an actual email
};

const sendCheckInConfirmationEmail = (booking: Booking) => {
  console.log(`Sending check-in confirmation email for booking ${booking.id}`);
  // In a real implementation, this would send an actual email
};

const sendFlightStatusUpdateEmail = (booking: Booking, flightStatus: FlightStatus) => {
  console.log(`Sending flight status update email for booking ${booking.id}`);
  // In a real implementation, this would send an actual email
};

// Server-Sent Events implementation
export const subscribeToBookingUpdates = (bookingId: string, callback: (event: BookingUpdateEvent) => void) => {
  if (!eventListeners[bookingId]) {
    eventListeners[bookingId] = [];
  }
  
  eventListeners[bookingId].push(callback);
  
  // Return unsubscribe function
  return () => {
    eventListeners[bookingId] = eventListeners[bookingId].filter(cb => cb !== callback);
  };
};

const emitBookingEvent = (event: BookingUpdateEvent) => {
  const { bookingId } = event;
  
  if (eventListeners[bookingId]) {
    eventListeners[bookingId].forEach(callback => callback(event));
  }
};

// Initialize mock data
initMockData();

// Export a simulated SSE endpoint for client-side use
export const createSSEConnection = (bookingId: string): EventSource | null => {
  if (typeof window === 'undefined') return null;
  
  const url = `/api/bookings/${bookingId}/events`;
  return new EventSource(url);
}; 