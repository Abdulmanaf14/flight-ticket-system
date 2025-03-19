'use client';

import { useAuth } from '../../../context/AuthContext';
import Navigation from '../../../components/Navigation';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Booking {
  id: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  origin: string;
  destination: string;
  passenger_name: string;
  booking_status: 'confirmed' | 'pending' | 'cancelled';
  seat?: string;
  gate?: string;
  terminal?: string;
  barcode?: string;
}

export default function BoardingPassPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch booking details
  useEffect(() => {
    if (user && bookingId) {
      // This would normally fetch from an API, but we're using mock data for this example
      setTimeout(() => {
        const mockBookings: Booking[] = [
          {
            id: '1',
            flight_number: 'SV123',
            departure_time: '2023-12-15T08:30:00',
            arrival_time: '2023-12-15T11:45:00',
            origin: 'JFK',
            destination: 'LAX',
            passenger_name: user.email?.split('@')[0] || 'User',
            booking_status: 'confirmed',
            seat: '12A',
            gate: 'B12',
            terminal: 'Terminal 4',
            barcode: '12345678901234567890'
          },
          {
            id: '2',
            flight_number: 'SV456',
            departure_time: '2024-01-10T14:15:00',
            arrival_time: '2024-01-10T16:30:00',
            origin: 'LAX',
            destination: 'SFO',
            passenger_name: user.email?.split('@')[0] || 'User',
            booking_status: 'pending',
            seat: '24C',
            gate: 'A5',
            terminal: 'Terminal 1',
            barcode: '09876543210987654321'
          }
        ];
        
        const foundBooking = mockBookings.find(b => b.id === bookingId);
        if (foundBooking) {
          setBooking(foundBooking);
        }
        setLoading(false);
      }, 800);
    }
  }, [user, bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-6">Booking Not Found</h1>
            <p className="text-white mb-6">The booking you are looking for does not exist or you don't have permission to view it.</p>
            <Link 
              href="/bookings" 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-150 shadow-md"
            >
              Back to Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (booking.booking_status !== 'confirmed') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-6">Boarding Pass Unavailable</h1>
            <p className="text-white mb-6">
              {booking.booking_status === 'pending' 
                ? 'Your booking is still pending. Boarding pass will be available once your booking is confirmed.'
                : 'This booking has been cancelled. Boarding pass is not available.'}
            </p>
            <Link 
              href="/bookings" 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-150 shadow-md"
            >
              Back to Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Boarding Pass</h1>
            <div className="flex space-x-3">
              <Link 
                href="/bookings" 
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-150 shadow-md"
              >
                Back to Bookings
              </Link>
              <button 
                onClick={handlePrint}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-150 shadow-md"
              >
                Print Boarding Pass
              </button>
            </div>
          </div>
          
          <div ref={printRef} className="bg-white rounded-lg p-6 border border-gray-200 print:shadow-none">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  SV
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">SkyVoyager Airlines</h2>
                  <p className="text-gray-500">E-Ticket / Boarding Pass</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800">{booking.flight_number}</p>
                <p className="text-gray-500">Confirmation: {booking.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Passenger</h3>
                <p className="text-gray-800 font-medium">{booking.passenger_name}</p>
                <p className="text-gray-500">Ticket: E-{booking.id}SV{booking.flight_number}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Flight</h3>
                <p className="text-gray-800 font-medium">{booking.flight_number}</p>
                <p className="text-gray-500">
                  {new Date(booking.departure_time).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">From</h3>
                <p className="text-gray-800 font-medium">{booking.origin}</p>
                <p className="text-gray-500">
                  {booking.terminal}, Gate {booking.gate}
                </p>
                <p className="text-gray-800 font-medium">
                  {new Date(booking.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">To</h3>
                <p className="text-gray-800 font-medium">{booking.destination}</p>
                <p className="text-gray-500">Estimated Arrival</p>
                <p className="text-gray-800 font-medium">
                  {new Date(booking.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6 p-4 bg-gray-100 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Seat</p>
                <p className="text-2xl font-bold text-gray-800">{booking.seat}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gate</p>
                <p className="text-2xl font-bold text-gray-800">{booking.gate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Boarding</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Date(
                    new Date(booking.departure_time).getTime() - 30 * 60000
                  ).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="text-2xl font-bold text-gray-800">Economy</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 font-mono text-sm">
                    {booking.barcode}
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  Please arrive at the airport at least 2 hours before departure. 
                  This is an electronic ticket, no paper ticket is required.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
} 