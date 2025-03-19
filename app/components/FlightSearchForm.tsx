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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit}>
        {/* Trip Type Selection */}
        <div className="mb-6 flex space-x-4">
          <div 
            className={`flex-1 py-3 text-center rounded-md cursor-pointer transition ${
              formData.tripType === 'round-trip' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleTripTypeChange('round-trip')}
          >
            Round Trip
          </div>
          <div 
            className={`flex-1 py-3 text-center rounded-md cursor-pointer transition ${
              formData.tripType === 'one-way' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleTripTypeChange('one-way')}
          >
            One Way
          </div>
        </div>

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <select
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">Select origin airport</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.code} - {airport.city} ({airport.name})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              required
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">Select destination airport</option>
              {airports.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.code} - {airport.city} ({airport.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date
            </label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleInputChange}
              min={today}
              required
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {formData.tripType === 'round-trip' && (
            <div>
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                Return Date
              </label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                min={minReturnDate}
                required={formData.tripType === 'round-trip'}
                className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Cabin Class */}
        <div className="mb-6">
          <label htmlFor="cabinClass" className="block text-sm font-medium text-gray-700 mb-1">
            Cabin Class
          </label>
          <select
            id="cabinClass"
            name="cabinClass"
            value={formData.cabinClass}
            onChange={handleInputChange}
            className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Economy">Economy</option>
            <option value="Premium Economy">Premium Economy</option>
            <option value="Business">Business</option>
            <option value="First">First</option>
          </select>
        </div>

        {/* Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
              Adults (12+ years)
            </label>
            <select
              id="adults"
              name="adults"
              value={formData.adults}
              onChange={handleNumberChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {[...Array(9)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
              Children (2-11 years)
            </label>
            <select
              id="children"
              name="children"
              value={formData.children}
              onChange={handleNumberChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="infants" className="block text-sm font-medium text-gray-700 mb-1">
              Infants (0-2 years)
            </label>
            <select
              id="infants"
              name="infants"
              value={formData.infants}
              onChange={handleNumberChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {[...Array(formData.adults + 1)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 px-6 rounded-md shadow-md text-lg font-medium transition duration-150"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
} 