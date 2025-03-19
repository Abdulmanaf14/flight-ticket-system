export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  passportNumber?: string;
  passportExpiry?: string;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  flightId: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  returnFlightId?: string;
  returnFlightNumber?: string;
  returnDepartureDate?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  passengers: Passenger[];
  cabinClass: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  checkInStatus?: 'not_available' | 'available' | 'completed';
  seatAssignments?: Record<string, string>; // passengerId: seatNumber
}

export interface FlightStatus {
  flightId: string;
  flightNumber: string;
  status: 'scheduled' | 'on_time' | 'delayed' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
  departureGate?: string;
  arrivalGate?: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
  delayMinutes?: number;
  updatedAt: string;
}

export interface BookingUpdateEvent {
  type: 'status_change' | 'check_in' | 'flight_update' | 'gate_change' | 'delay';
  bookingId: string;
  message: string;
  timestamp: string;
  details?: Record<string, any>;
} 