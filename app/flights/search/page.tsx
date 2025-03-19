'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import FlightCard from '../../components/FlightCard';
import { searchFlights, Flight } from '../../lib/mockData';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [flightResults, setFlightResults] = useState<{
    departureFlights: Flight[];
    returnFlights: Flight[] | null;
  } | null>(null);
  const [sortOption, setSortOption] = useState('price');
  const [activeTab, setActiveTab] = useState('departure');

  useEffect(() => {
    // Get search parameters
    const tripType = searchParams.get('tripType') || 'one-way';
    const origin = searchParams.get('origin') || '';
    const destination = searchParams.get('destination') || '';
    const departureDate = searchParams.get('departureDate') || '';
    const returnDate = searchParams.get('returnDate') || undefined;
    const cabinClass = searchParams.get('cabinClass') || 'Economy';
    const adults = parseInt(searchParams.get('adults') || '1');
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');
    
    const totalPassengers = adults + children + infants;
    
    if (origin && destination && departureDate) {
      // Simulate API call delay
      setTimeout(() => {
        const results = searchFlights(
          origin,
          destination,
          departureDate,
          returnDate || undefined,
          cabinClass,
          totalPassengers
        );
        setFlightResults(results);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  // Function to sort flights based on the selected option
  const sortFlights = (flights: Flight[]): Flight[] => {
    switch (sortOption) {
      case 'price':
        return [...flights].sort((a, b) => a.price - b.price);
      case 'duration':
        return [...flights].sort((a, b) => {
          const getDurationMinutes = (duration: string) => {
            const [hours, minutes] = duration.split('h ');
            return parseInt(hours) * 60 + parseInt(minutes.replace('m', ''));
          };
          return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
        });
      case 'departure':
        return [...flights].sort(
          (a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
        );
      case 'arrival':
        return [...flights].sort(
          (a, b) => new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime()
        );
      default:
        return flights;
    }
  };

  // Format search params for display
  const formatSearchParams = () => {
    const tripType = searchParams.get('tripType') || 'one-way';
    const origin = searchParams.get('origin') || '';
    const destination = searchParams.get('destination') || '';
    const departureDate = searchParams.get('departureDate') 
      ? new Date(searchParams.get('departureDate')!).toLocaleDateString([], { month: 'short', day: 'numeric' })
      : '';
    const returnDate = searchParams.get('returnDate')
      ? new Date(searchParams.get('returnDate')!).toLocaleDateString([], { month: 'short', day: 'numeric' })
      : '';
    const cabinClass = searchParams.get('cabinClass') || 'Economy';
    const adults = parseInt(searchParams.get('adults') || '1');
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');
    
    const totalPassengers = adults + children + infants;
    const passengerText = `${totalPassengers} ${totalPassengers === 1 ? 'passenger' : 'passengers'}`;
    
    return {
      tripType: tripType === 'round-trip' ? 'Round Trip' : 'One Way',
      route: `${origin} → ${destination}${tripType === 'round-trip' ? ' → ' + origin : ''}`,
      dates: tripType === 'round-trip' ? `${departureDate} - ${returnDate}` : departureDate,
      passengers: passengerText,
      cabinClass
    };
  };

  const searchDetails = formatSearchParams();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Searching for flights...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!flightResults || (!flightResults.departureFlights.length && !flightResults.returnFlights)) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Flights Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any flights matching your search criteria. Please try different dates or destinations.
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

  // Determine which flights to show based on active tab
  const currentFlights = activeTab === 'departure' 
    ? flightResults.departureFlights 
    : flightResults.returnFlights || [];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{searchDetails.route}</h1>
              <p className="text-gray-600 text-sm">
                {searchDetails.tripType} • {searchDetails.dates} • {searchDetails.passengers} • {searchDetails.cabinClass}
              </p>
            </div>
            <Link
              href="/"
              className="mt-3 md:mt-0 inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              Modify Search
            </Link>
          </div>
        </div>

        {/* Trip Tabs (for round trip) */}
        {flightResults.returnFlights && (
          <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
            <div className="grid grid-cols-2">
              <button
                className={`py-4 text-center font-medium ${
                  activeTab === 'departure' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('departure')}
              >
                Outbound Flight
              </button>
              <button
                className={`py-4 text-center font-medium ${
                  activeTab === 'return' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('return')}
              >
                Return Flight
              </button>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-700">
              {sortFlights(currentFlights).length} flights found
            </p>
            <div className="flex items-center">
              <label htmlFor="sort" className="text-sm text-gray-700 mr-2">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price">Price: Lowest first</option>
                <option value="duration">Duration: Shortest first</option>
                <option value="departure">Departure: Earliest first</option>
                <option value="arrival">Arrival: Earliest first</option>
              </select>
            </div>
          </div>
        </div>

        {/* Flight List */}
        <div className="space-y-4">
          {sortFlights(currentFlights).map((flight) => (
            <FlightCard 
              key={flight.id} 
              flight={flight} 
              searchParams={Object.fromEntries(searchParams.entries())}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 