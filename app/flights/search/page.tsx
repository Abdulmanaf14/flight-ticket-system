'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import FlightCard from '../../components/FlightCard';
import { searchFlights, Flight } from '../../lib/mockData';
import Navigation from '../../components/Navigation';

function SearchResultsContent() {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex justify-center items-center">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#4169E1] rounded-full"></div>
            <p className="ml-4 text-gray-700 font-medium">Searching for flights...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!flightResults || (!flightResults.departureFlights.length && !flightResults.returnFlights)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">No Flights Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any flights matching your search criteria. Please try different dates or destinations.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#4169E1] hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#4169E1]">Available Flights</h1>
          <p className="text-gray-600 mt-2">Choose from our selection of flights that best suit your needs</p>
        </div>
        
        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{searchDetails.route}</h2>
              <p className="text-gray-600 text-sm">
                {searchDetails.tripType} • {searchDetails.dates} • {searchDetails.passengers} • {searchDetails.cabinClass}
              </p>
            </div>
            <Link
              href="/"
              className="mt-3 md:mt-0 inline-flex items-center text-[#4169E1] hover:text-blue-600 font-medium transition-colors"
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Modify Search
            </Link>
          </div>
        </div>

        {/* Trip Tabs (for round trip) */}
        {flightResults.returnFlights && (
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <div className="grid grid-cols-2">
              <button
                className={`py-4 text-center font-medium transition-colors ${
                  activeTab === 'departure' ? 'bg-[#4169E1] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('departure')}
              >
                Outbound Flight
              </button>
              <button
                className={`py-4 text-center font-medium transition-colors ${
                  activeTab === 'return' ? 'bg-[#4169E1] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('return')}
              >
                Return Flight
              </button>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-700">
              {sortFlights(currentFlights).length} flights found
            </p>
            <div className="flex items-center">
              <label htmlFor="sort" className="text-sm text-gray-600 mr-2">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-[#4169E1] focus:border-[#4169E1]"
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
            <div key={flight.id} className="bg-white rounded-lg shadow-md transform transition-all hover:shadow-lg hover:scale-[1.01] overflow-hidden">
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

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Loading search results...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>}>
      <SearchResultsContent />
    </Suspense>
  );
} 