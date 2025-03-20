'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { Booking, BookingUpdateEvent } from '../../lib/types';
import { createSSEConnection } from '../../lib/bookingService';

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<BookingUpdateEvent[]>([]);
  const [showUpdates, setShowUpdates] = useState(false);

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    
    if (!bookingId) {
      router.push('/');
      return;
    }

    // Fetch booking details from the API
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        
        const bookingData = await response.json();
        setBooking(bookingData);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [searchParams, router]);

  // Set up SSE connection for real-time updates
  useEffect(() => {
    if (!booking) return;

    // Create SSE connection
    const eventSource = createSSEConnection(booking.id);
    
    if (!eventSource) return;

    // Listen for messages
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as BookingUpdateEvent;
      setStatusUpdates(prev => [data, ...prev]);
    };

    // Handle errors
    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      eventSource.close();
    };

    // Clean up on unmount
    return () => {
      eventSource.close();
    };
  }, [booking]);

  // Handle downloading e-ticket
  const handleDownloadETicket = async () => {
    if (!booking) return;
    
    try {
      // In a real app, this would download a PDF
      // For this demo, we'll just fetch the data and open in a new tab
      window.open(`/api/bookings/${booking.id}/eticket`, '_blank');
    } catch (err) {
      console.error('Error downloading e-ticket:', err);
      alert('Failed to download e-ticket');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading booking confirmation...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find your booking. Please try again or contact customer support."}
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-50 border-b border-green-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
                  {booking.status === 'confirmed' ? 'Confirmed' : booking.status}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Booking Confirmation</h1>
                <p className="text-gray-600 mt-1">Thank you for booking with Sky Voyager!</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Booking Reference</p>
                <p className="text-xl font-bold text-gray-800">{booking.id.substring(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Flight Info */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Flight Information</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Airline</p>
                  <p className="font-medium">{booking.airline}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Flight</p>
                  <p className="font-medium">{booking.flightNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(booking.departureDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">{booking.cabinClass}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="text-right mr-4">
                  <p className="font-bold text-lg">{booking.departureTime}</p>
                  <p className="text-gray-500 text-sm">{booking.origin}</p>
                </div>
                
                <div className="flex-grow mx-2 px-2">
                  <div className="relative flex items-center">
                    <div className="h-0.5 bg-gray-300 w-full"></div>
                    <div className="absolute left-0 -mt-1">
                      <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 12 12">
                        <circle cx="6" cy="6" r="6" />
                      </svg>
                    </div>
                    <div className="absolute right-0 -mt-1">
                      <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 12 12">
                        <circle cx="6" cy="6" r="6" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="text-left ml-4">
                  <p className="font-bold text-lg">{booking.arrivalTime}</p>
                  <p className="text-gray-500 text-sm">{booking.destination}</p>
                </div>
              </div>
            </div>

            {/* Return flight info if applicable */}
            {booking.returnFlightNumber && booking.returnDepartureDate && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 mt-4">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Return Flight</span>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Flight</p>
                    <p className="font-medium">{booking.returnFlightNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(booking.returnDepartureDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <p className="font-bold text-lg">{booking.returnDepartureTime}</p>
                    <p className="text-gray-500 text-sm">{booking.destination}</p>
                  </div>
                  
                  <div className="flex-grow mx-2 px-2">
                    <div className="relative flex items-center">
                      <div className="h-0.5 bg-gray-300 w-full"></div>
                      <div className="absolute left-0 -mt-1">
                        <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 12 12">
                          <circle cx="6" cy="6" r="6" />
                        </svg>
                      </div>
                      <div className="absolute right-0 -mt-1">
                        <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 12 12">
                          <circle cx="6" cy="6" r="6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left ml-4">
                    <p className="font-bold text-lg">{booking.returnArrivalTime}</p>
                    <p className="text-gray-500 text-sm">{booking.origin}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-700 mb-2">Passengers</h3>
              <div className="space-y-2">
                {booking.passengers.map((passenger, index) => (
                  <div key={passenger.id} className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{passenger.firstName} {passenger.lastName}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Seat: {booking.seatAssignments?.[passenger.id] || 'To be assigned'}</span>
                      <span>Passenger {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h2>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600">Total Amount Paid</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">${booking.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Payment method: {booking.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Real-time Updates */}
          {statusUpdates.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Flight Status Updates
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Live
                  </span>
                </h2>
                <button 
                  onClick={() => setShowUpdates(!showUpdates)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showUpdates ? 'Hide' : 'Show'} Updates
                </button>
              </div>

              {showUpdates && (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {statusUpdates.map((update, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{update.message}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="p-6 bg-gray-50 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              A confirmation has been sent to your email address.
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleDownloadETicket}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                E-Ticket
              </button>
              <Link 
                href={`/bookings/${booking.id}/manage`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Manage Booking
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Important Information</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Please arrive at the airport at least 2 hours before your scheduled departure time.</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Don't forget to bring a valid photo ID or passport for your journey.</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>You can check-in online 24 hours before your flight departure.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Loading booking details...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>}>
      <ConfirmationContent />
    </Suspense>
  );
} 