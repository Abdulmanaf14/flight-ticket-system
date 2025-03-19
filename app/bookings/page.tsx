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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#4169E1] rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#4169E1]">Your Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your flight reservations</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-600">Welcome back, <span className="font-medium text-gray-800">{user.email?.split('@')[0]}</span></p>
            <Link 
              href="/flights/search" 
              className="bg-[#4169E1] hover:bg-blue-600 text-white py-3 px-6 rounded-full transition duration-150 shadow-md font-medium"
            >
              Book New Flight
            </Link>
          </div>
          
          {loadingBookings ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#4169E1] rounded-full"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-blue-50 rounded-xl">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <p className="text-gray-700 text-lg mb-4 font-medium">You don't have any bookings yet.</p>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Start planning your next adventure by searching for flights to your favorite destination.</p>
              <Link 
                href="/flights/search" 
                className="bg-[#4169E1] hover:bg-blue-600 text-white py-3 px-6 rounded-full transition duration-150 shadow-md font-medium"
              >
                Book Your First Flight
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Flight</p>
                      <p className="text-gray-800 font-semibold">{booking.flight_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Route</p>
                      <p className="text-gray-800 font-semibold">{booking.origin} → {booking.destination}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Date</p>
                      <p className="text-gray-800 font-semibold">{new Date(booking.departure_time).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Status</p>
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
                          className="text-[#4169E1] hover:text-blue-700 text-xs transition-colors duration-150 flex items-center font-medium"
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
                  
                  <div className="mt-6 border-t border-gray-100 pt-6 flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 text-sm">Departure</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(booking.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <div className="flex-1 mx-4 border-t border-dashed border-gray-300 relative">
                      <div className="flex justify-between absolute w-full -mt-3">
                        <span className="bg-[#4169E1] text-white h-6 w-6 flex items-center justify-center rounded-full shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="bg-[#4169E1] text-white h-6 w-6 flex items-center justify-center rounded-full shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.25.75a.75.75 0 011.5 0v.5a.75.75 0 01-1.5 0v-.5z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Arrival</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(booking.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-4">
                    <Link 
                      href={`/bookings/${booking.id}`}
                      className="text-[#4169E1] hover:text-blue-700 transition-colors duration-150 font-medium"
                    >
                      Manage Booking
                    </Link>
                    <Link 
                      href={`/bookings/${booking.id}/boarding-pass`}
                      className={`bg-[#4169E1] text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-150 ${
                        booking.booking_status !== 'confirmed' ? 'opacity-50 pointer-events-none bg-gray-400' : ''
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