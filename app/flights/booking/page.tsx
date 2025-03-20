'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Flight } from '../../lib/mockData';
import { Passenger } from '../../lib/types';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    passportNumber: '',
    passportExpiry: '',
    dateOfBirth: '',
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For demo purposes, simulate fetching flight details
  useEffect(() => {
    const flightId = searchParams.get('flightId');
    
    if (!flightId) {
      router.push('/');
      return;
    }
    
    // In a real app, we would fetch flight details from an API
    // For this demo, we'll create a mock flight
    const [origin, destination, timestamp] = flightId.split('-');
    
    setTimeout(() => {
      const mockFlight: Flight = {
        id: flightId,
        flightNumber: `SK${Math.floor(1000 + Math.random() * 9000)}`,
        airline: 'Sky Voyager Airways',
        origin: origin,
        destination: destination,
        departureTime: new Date(parseInt(timestamp)).toISOString(),
        arrivalTime: new Date(parseInt(timestamp) + 3 * 60 * 60 * 1000).toISOString(),
        duration: '3h 00m',
        price: 350 + Math.floor(Math.random() * 200),
        availableSeats: 15,
        cabinClass: searchParams.get('cabinClass') || 'Economy',
      };
      
      setFlight(mockFlight);
      setLoading(false);
    }, 1000);
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!flight) return;

    try {
      // Prepare passenger data
      const passenger: Passenger = {
        id: '',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || undefined,
        city: formData.city || undefined,
        zipCode: formData.zipCode || undefined,
        country: formData.country || undefined,
        passportNumber: formData.passportNumber || undefined,
        passportExpiry: formData.passportExpiry || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        specialRequests: formData.specialRequests || undefined,
      };

      // Calculate total amount including taxes
      const totalAmount = flight.price + Math.round(flight.price * 0.12);

      // Prepare booking data
      const bookingData = {
        flightId: flight.id,
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        origin: flight.origin,
        destination: flight.destination,
        departureDate: formatDate(flight.departureTime),
        departureTime: formatTime(flight.departureTime),
        arrivalTime: formatTime(flight.arrivalTime),
        passengers: [passenger],
        cabinClass: flight.cabinClass,
        totalAmount,
        paymentMethod: formData.paymentMethod,
      };

      // Make API request to create booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const bookingResult = await response.json();
      
      // Redirect to confirmation page
      router.push(`/flights/confirmation?bookingId=${bookingResult.id}`);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Flight Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the flight you're looking for. Please try searching again.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600">Please fill in the required information to confirm your flight.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side: Booking form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <form onSubmit={handleSubmit}>
                {/* Passenger Information */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Passenger Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Passport Number
                      </label>
                      <input
                        type="text"
                        id="passportNumber"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="passportExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Passport Expiry Date
                      </label>
                      <input
                        type="date"
                        id="passportExpiry"
                        name="passportExpiry"
                        value={formData.passportExpiry}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests
                      </label>
                      <input
                        type="text"
                        id="specialRequests"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Wheelchair assistance, special meals, etc."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="India">India</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="China">China</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="credit-card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>

                    {formData.paymentMethod === 'credit-card' && (
                      <>
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              id="cardHolder"
                              name="cardHolder"
                              value={formData.cardHolder}
                              onChange={handleInputChange}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="p-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 
                      ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium`}
                  >
                    {isSubmitting ? 'Processing...' : 'Complete Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right side: Flight summary */}
          <div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Flight Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Flight</span>
                    <span className="font-medium">{flight.flightNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Airline</span>
                    <span className="font-medium">{flight.airline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{formatDate(flight.departureTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Departure</span>
                    <span className="font-medium">{flight.origin} ({formatTime(flight.departureTime)})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Arrival</span>
                    <span className="font-medium">{flight.destination} ({formatTime(flight.arrivalTime)})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{flight.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cabin Class</span>
                    <span className="font-medium">{flight.cabinClass}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span>${flight.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span>${Math.round(flight.price * 0.12)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-gray-200 flex items-center justify-between font-bold">
                    <span>Total</span>
                    <span>${flight.price + Math.round(flight.price * 0.12)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Loading booking page...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>}>
      <BookingContent />
    </Suspense>
  );
} 