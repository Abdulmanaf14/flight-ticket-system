'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

type TripType = 'one-way' | 'round-trip';
type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First';

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

interface SearchFormData {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: CabinClass;
}

export default function FlightSearchForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SearchFormData>({
    tripType: 'round-trip',
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'Economy',
  });
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        console.log('Fetching airports...');
        const { data, error } = await supabase
          .from('airports')
          .select('code, name, city, country')
          .order('code');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        console.log('Airports data:', data);
        setAirports(data || []);
      } catch (error: any) {
        console.error('Error fetching airports:', error);
        // Log the full error object
        console.error('Full error details:', {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleTripTypeChange = (type: TripType) => {
    setFormData((prev) => ({ ...prev, tripType: type }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('tripType', formData.tripType);
    params.append('origin', formData.origin);
    params.append('destination', formData.destination);
    params.append('departureDate', formData.departureDate);
    
    if (formData.tripType === 'round-trip') {
      params.append('returnDate', formData.returnDate);
    }
    
    params.append('adults', formData.adults.toString());
    params.append('children', formData.children.toString());
    params.append('infants', formData.infants.toString());
    params.append('cabinClass', formData.cabinClass);
    
    // Navigate to search results page with query parameters
    router.push(`/flights/search?${params.toString()}`);
  };

  // Calculate minimum dates
  const today = new Date().toISOString().split('T')[0];
  const minReturnDate = formData.departureDate || today;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Trip Type Selection */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white p-1 rounded-full shadow-md">
            <button
              type="button"
              onClick={() => handleTripTypeChange('round-trip')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                formData.tripType === 'round-trip'
                  ? 'bg-[#4169E1] text-white shadow-md'
                  : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              Round Trip
            </button>
            <button
              type="button"
              onClick={() => handleTripTypeChange('one-way')}
              className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                formData.tripType === 'one-way'
                  ? 'bg-[#4169E1] text-white shadow-md'
                  : 'text-gray-700 hover:bg-blue-100'
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              disabled
              className="px-8 py-3 rounded-full text-sm font-medium text-gray-400 cursor-not-allowed"
            >
              Multi-City
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Origin & Destination */}
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg className="h-5 w-5 text-[#4169E1] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                From
              </label>
              <select
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                required
                className="block w-full py-4 px-4 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-black"
                disabled={loading}
              >
                <option value="">Select origin city or airport</option>
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.code} - {airport.city} ({airport.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg className="h-5 w-5 text-[#4169E1] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                To
              </label>
              <select
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
                className="block w-full py-4 px-4 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-black"
                disabled={loading}
              >
                <option value="">Select destination city or airport</option>
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.code} - {airport.city} ({airport.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Date selection */}
            <div>
              <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg className="h-5 w-5 text-[#4169E1] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Departure
              </label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                min={today}
                value={formData.departureDate}
                onChange={handleInputChange}
                required
                className="block w-full py-4 px-4 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-black"
              />
            </div>

            {formData.tripType === 'round-trip' && (
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg className="h-5 w-5 text-[#4169E1] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Return
                </label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  min={minReturnDate}
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  required
                  className="block w-full py-4 px-4 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-black"
                />
              </div>
            )}
          </div>
        </div>

        {/* Travelers and Cabin */}
        <div className="mb-10">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <svg className="h-5 w-5 text-[#4169E1] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Travelers & Class
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-2">
                Adults (12+)
              </label>
              <select
                id="adults"
                name="adults"
                value={formData.adults}
                onChange={handleNumberChange}
                className="block w-full py-4 px-4 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-black"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-2">
                Children (2-11)
              </label>
              <select
                id="children"
                name="children"
                value={formData.children}
                onChange={handleNumberChange}
                className="block w-full py-4 px-4 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-black "
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="infants" className="block text-sm font-medium text-gray-700 mb-2">
                Infants (0-2)
              </label>
              <select
                id="infants"
                name="infants"
                value={formData.infants}
                onChange={handleNumberChange}
                className="block w-full py-4 px-4 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-black"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cabinClass" className="block text-sm font-medium text-gray-700 mb-2">
                Cabin Class
              </label>
              <select
                id="cabinClass"
                name="cabinClass"
                value={formData.cabinClass}
                onChange={handleInputChange}
                className="block w-full py-4 px-4 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-black"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="inline-flex items-center justify-center px-16 py-5 bg-[#4169E1] hover:bg-blue-600 text-white text-lg font-medium rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Explore Flights
          </button>
        </div>
      </form>
    </div>
  );
} 