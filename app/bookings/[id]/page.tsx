'use client';

import { useAuth } from '../../context/AuthContext';
import Navigation from '../../components/Navigation';
import { useRouter, useParams } from 'next/navigation';
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

export default function ManageBookingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [passengerName, setPassengerName] = useState('');
  const [status, setStatus] = useState<'confirmed' | 'pending' | 'cancelled'>('confirmed');
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
        
        const foundBooking = mockBookings.find(b => b.id === bookingId);
        if (foundBooking) {
          setBooking(foundBooking);
          setPassengerName(foundBooking.passenger_name);
          setStatus(foundBooking.booking_status);
        }
        setLoading(false);
      }, 800);
    }
  }, [user, bookingId]);

  const handleUpdateBooking = () => {
    if (!booking) return;
    
    // This would normally send to an API, but we're just simulating
    setLoading(true);
    setTimeout(() => {
      // Update booking with new values
      setBooking({
        ...booking,
        passenger_name: passengerName,
        booking_status: status
      });
      setLoading(false);
      setUpdateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    }, 800);
  };

  const handleCancelBooking = () => {
    if (!booking) return;
    
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setLoading(true);
      setTimeout(() => {
        setBooking({
          ...booking,
          booking_status: 'cancelled'
        });
        setStatus('cancelled');
        setLoading(false);
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }, 800);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Manage Booking</h1>
            <Link 
              href="/bookings" 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-150 shadow-md"
            >
              Back to Bookings
            </Link>
          </div>
          
          {updateSuccess && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">Your booking has been updated successfully.</span>
            </div>
          )}
          
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-blue-200 text-sm">Flight</p>
                <p className="text-white font-semibold">{booking.flight_number}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Route</p>
                <p className="text-white font-semibold">{booking.origin} → {booking.destination}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Departure</p>
                <p className="text-white font-semibold">
                  {new Date(booking.departure_time).toLocaleDateString()} at {' '}
                  {new Date(booking.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Arrival</p>
                <p className="text-white font-semibold">
                  {new Date(booking.arrival_time).toLocaleDateString()} at {' '}
                  {new Date(booking.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Booking Details</h2>
            
            <div className="mb-4">
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Passenger Name
              </label>
              <input
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-blue-200 text-sm font-medium mb-2">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'confirmed' | 'pending' | 'cancelled')}
                className="w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={booking.booking_status === 'cancelled'}
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handleCancelBooking}
                disabled={booking.booking_status === 'cancelled'}
                className={`bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-150 shadow-md ${
                  booking.booking_status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Cancel Booking
              </button>
              
              <button
                onClick={handleUpdateBooking}
                disabled={booking.booking_status === 'cancelled'}
                className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-150 shadow-md ${
                  booking.booking_status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Update Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 