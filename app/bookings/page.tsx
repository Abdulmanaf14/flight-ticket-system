'use client';

import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import FlightStatus from '../components/FlightStatus';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
}

export default function BookingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);

  // Toggle flight status expansion
  const toggleFlightStatus = (flightNumber: string) => {
    if (expandedStatus === flightNumber) {
      setExpandedStatus(null);
    } else {
      setExpandedStatus(flightNumber);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch user bookings
  useEffect(() => {
    if (user) {
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
            booking_status: 'confirmed'
          },
          {
            id: '2',
            flight_number: 'SV456',
            departure_time: '2024-01-10T14:15:00',
            arrival_time: '2024-01-10T16:30:00',
            origin: 'LAX',
            destination: 'SFO',
            passenger_name: user.email?.split('@')[0] || 'User',
            booking_status: 'pending'
          }
        ];
        setBookings(mockBookings);
        setLoadingBookings(false);
      }, 1000);
    }
  }, [user]);

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Your Bookings</h1>
            <Link 
              href="/flights/search" 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-150 shadow-md"
            >
              Book New Flight
            </Link>
          </div>
          
          {loadingBookings ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-white rounded-full"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white text-lg mb-4">You don't have any bookings yet.</p>
              <Link 
                href="/flights/search" 
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-150 shadow-md"
              >
                Book Your First Flight
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-blue-200 text-sm">Flight</p>
                      <p className="text-white font-semibold">{booking.flight_number}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Route</p>
                      <p className="text-white font-semibold">{booking.origin} → {booking.destination}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Date</p>
                      <p className="text-white font-semibold">{new Date(booking.departure_time).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Status</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                        </span>
                        
                        <button 
                          onClick={() => toggleFlightStatus(booking.flight_number)}
                          className="text-blue-300 hover:text-white text-xs transition-colors duration-150 flex items-center"
                        >
                          {expandedStatus === booking.flight_number ? (
                            <>
                              Hide live status
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            </>
                          ) : (
                            <>
                              Show live status
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                      
                      {expandedStatus === booking.flight_number && (
                        <FlightStatus flightNumber={booking.flight_number} />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-white/10 pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-blue-200 text-sm">Departure</p>
                      <p className="text-white font-medium">
                        {new Date(booking.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <div className="flex-1 mx-4 border-t border-dashed border-white/30 relative">
                      <div className="flex justify-between absolute w-full -mt-3">
                        <span className="bg-blue-500 text-white h-6 w-6 flex items-center justify-center rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="bg-blue-500 text-white h-6 w-6 flex items-center justify-center rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.25.75a.75.75 0 011.5 0v.5a.75.75 0 01-1.5 0v-.5z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">Arrival</p>
                      <p className="text-white font-medium">
                        {new Date(booking.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <Link 
                      href={`/bookings/${booking.id}`}
                      className="text-blue-300 hover:text-white transition-colors duration-150"
                    >
                      Manage Booking
                    </Link>
                    <Link 
                      href={`/bookings/${booking.id}/boarding-pass`}
                      className={`text-blue-300 hover:text-white transition-colors duration-150 ${
                        booking.booking_status !== 'confirmed' ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      Boarding Pass
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 