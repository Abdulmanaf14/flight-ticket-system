'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Booking, FlightStatus, BookingUpdateEvent } from '../../../lib/types';
import { createSSEConnection } from '../../../lib/bookingService';

export default function ManageBookingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [flightStatus, setFlightStatus] = useState<FlightStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<BookingUpdateEvent[]>([]);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings/${bookingId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        
        const bookingData = await response.json();
        setBooking(bookingData);
        
        // Fetch flight status
        const statusResponse = await fetch(`/api/flights/${bookingData.flightId}/status`);
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setFlightStatus(statusData);
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  // Set up SSE connection for real-time updates
  useEffect(() => {
    if (!booking) return;

    // Create SSE connection
    const eventSource = createSSEConnection(bookingId);
    
    if (!eventSource) return;

    // Listen for messages
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as BookingUpdateEvent;
      setStatusUpdates(prev => [data, ...prev]);
      
      // Update flight status if we receive a flight_update event
      if (data.type === 'flight_update' && data.details?.flightStatus) {
        setFlightStatus(data.details.flightStatus);
      }
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
  }, [booking, bookingId]);

  // Cancel booking
  const handleCancelBooking = async () => {
    try {
      setIsCancelling(true);
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }
      
      // Update local booking state
      const updatedBooking = await response.json();
      setBooking(updatedBooking);
      setCancelSuccess(true);
      setShowConfirmCancel(false);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  // Download e-ticket
  const handleDownloadETicket = async () => {
    if (!booking) return;
    
    try {
      window.open(`/api/bookings/${bookingId}/eticket`, '_blank');
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
              <p className="mt-4 text-gray-700">Loading booking details...</p>
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'on_time':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'scheduled':
      case 'boarding':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isBookingModifiable = booking.status !== 'cancelled' && booking.status !== 'completed';
  const departureDate = new Date(booking.departureDate);
  const now = new Date();
  const daysDifference = Math.ceil((departureDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const canCancel = isBookingModifiable && daysDifference > 1;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 mr-3">Manage Booking</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Booking reference: <span className="font-medium">{booking.id.substring(0, 8).toUpperCase()}</span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Book another flight
              </Link>
            </div>
          </div>
        </div>

        {/* Success message after cancellation */}
        {cancelSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Booking cancelled</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your booking has been successfully cancelled. A confirmation email has been sent to your registered email address.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flight Information */}
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Flight Details</h2>
                  {flightStatus && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(flightStatus.status)}`}>
                      {flightStatus.status.replace('_', ' ').toUpperCase()}
                    </span>
                  )}
                </div>
                
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
                      {flightStatus?.departureGate && (
                        <p className="text-xs text-blue-600">Gate {flightStatus.departureGate}</p>
                      )}
                    </div>
                    
                    <div className="flex-grow mx-2 px-2">
                      <div className="relative flex items-center justify-center">
                        <div className="h-0.5 bg-gray-300 w-full"></div>
                        {flightStatus?.status === 'delayed' && (
                          <div className="absolute text-yellow-500 text-xs whitespace-nowrap">
                            Delayed {flightStatus.delayMinutes} min
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-left ml-4">
                      <p className="font-bold text-lg">{booking.arrivalTime}</p>
                      <p className="text-gray-500 text-sm">{booking.destination}</p>
                      {flightStatus?.arrivalGate && (
                        <p className="text-xs text-blue-600">Gate {flightStatus.arrivalGate}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Return flight if applicable */}
                {booking.returnFlightNumber && booking.returnDepartureDate && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
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
                        </div>
                      </div>
                      
                      <div className="text-left ml-4">
                        <p className="font-bold text-lg">{booking.returnArrivalTime}</p>
                        <p className="text-gray-500 text-sm">{booking.origin}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3">Passengers</h3>
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
            
            {/* Flight Status Updates */}
            {statusUpdates.length > 0 && (
              <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Status Updates</h2>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Live
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
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
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Trip Summary */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Trip Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid</span>
                    <span className="font-bold">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span>{booking.paymentMethod}</span>
                  </div>
                  {booking.status === 'cancelled' && (
                    <div className="flex justify-between text-red-600">
                      <span>Status</span>
                      <span className="font-medium">Cancelled</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <button
                    onClick={handleDownloadETicket}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    Download E-Ticket
                  </button>
                  
                  {isBookingModifiable && booking.checkInStatus === 'available' && (
                    <Link
                      href={`/bookings/${booking.id}/check-in`}
                      className="w-full flex justify-center py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none"
                    >
                      Online Check-in
                    </Link>
                  )}
                  
                  {canCancel && (
                    <button
                      onClick={() => setShowConfirmCancel(true)}
                      className="w-full flex justify-center py-2 px-4 border border-red-500 rounded-md shadow-sm text-sm font-medium text-red-500 bg-white hover:bg-red-50 focus:outline-none"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer Service</h3>
                    <p className="mt-1">1-800-SKY-HELP (1-800-759-4357)</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">support@skyvoyager.com</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Hours</h3>
                    <p className="mt-1">24/7 for urgent travel matters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancellation confirmation modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowConfirmCancel(false)}></div>
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl z-10">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Cancel Booking
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to cancel this booking? This action cannot be undone,
                    and any refund will be processed according to our cancellation policy.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelBooking}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                  isCancelling ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmCancel(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 