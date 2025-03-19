'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import FlightCard from '../../components/FlightCard';
import { searchFlights, Flight } from '../../lib/mockData';
import Navigation from '../../components/Navigation';

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
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-white rounded-full"></div>
            <p className="ml-4 text-white">Searching for flights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!flightResults || (!flightResults.departureFlights.length && !flightResults.returnFlights)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Flights Found</h2>
            <p className="text-blue-100 mb-6">
              We couldn't find any flights matching your search criteria. Please try different dates or destinations.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md"
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
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-indigo-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Summary */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{searchDetails.route}</h1>
              <p className="text-blue-200 text-sm">
                {searchDetails.tripType} • {searchDetails.dates} • {searchDetails.passengers} • {searchDetails.cabinClass}
              </p>
            </div>
            <Link
              href="/"
              className="mt-3 md:mt-0 inline-block text-blue-300 hover:text-white font-medium transition-colors"
            >
              Modify Search
            </Link>
          </div>
        </div>

        {/* Trip Tabs (for round trip) */}
        {flightResults.returnFlights && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl mb-6 overflow-hidden border border-white/20">
            <div className="grid grid-cols-2">
              <button
                className={`py-4 text-center font-medium transition-colors ${
                  activeTab === 'departure' ? 'bg-blue-500 text-white' : 'bg-white/5 text-blue-100 hover:bg-white/10'
                }`}
                onClick={() => setActiveTab('departure')}
              >
                Outbound Flight
              </button>
              <button
                className={`py-4 text-center font-medium transition-colors ${
                  activeTab === 'return' ? 'bg-blue-500 text-white' : 'bg-white/5 text-blue-100 hover:bg-white/10'
                }`}
                onClick={() => setActiveTab('return')}
              >
                Return Flight
              </button>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-4 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <p className="text-white">
              {sortFlights(currentFlights).length} flights found
            </p>
            <div className="flex items-center">
              <label htmlFor="sort" className="text-sm text-blue-200 mr-2">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            <div key={flight.id} className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl border border-white/20 transform transition-all hover:scale-[1.01]">
              <FlightCard 
                flight={flight} 
                searchParams={Object.fromEntries(searchParams.entries())}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 