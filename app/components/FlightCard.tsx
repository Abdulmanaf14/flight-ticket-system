'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FlightCardProps {
  flight: {
    id: string;
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    availableSeats: number;
    cabinClass: string;
  };
  searchParams: Record<string, string>;
}

export default function FlightCard({ flight, searchParams }: FlightCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  };
  
  const departure = formatTime(flight.departureTime);
  const arrival = formatTime(flight.arrivalTime);
  
  const handleBooking = () => {
    const params = new URLSearchParams(searchParams);
    params.append('flightId', flight.id);
    router.push(`/flights/booking?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Airline and flight info */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <span className="text-blue-800 font-bold text-sm">{flight.airline.substring(0, 2)}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{flight.airline}</p>
              <p className="font-medium">Flight {flight.flightNumber}</p>
            </div>
          </div>

          {/* Flight time and route */}
          <div className="flex-grow md:mx-6 mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="text-right mr-3">
                <p className="font-bold text-lg">{departure.time}</p>
                <p className="text-gray-500 text-sm">{flight.origin}</p>
              </div>
              
              <div className="flex-grow mx-2 px-2">
                <div className="relative flex items-center justify-center">
                  <div className="h-0.5 bg-gray-300 w-full"></div>
                  <div className="absolute text-gray-500 text-xs whitespace-nowrap">
                    {flight.duration}
                  </div>
                </div>
              </div>
              
              <div className="text-left ml-3">
                <p className="font-bold text-lg">{arrival.time}</p>
                <p className="text-gray-500 text-sm">{flight.destination}</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{departure.date}</span>
              <span>{arrival.date}</span>
            </div>
          </div>

          {/* Price and booking */}
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
            <p className="text-gray-500 text-sm">{flight.cabinClass}</p>
            <button 
              onClick={handleBooking}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-150"
            >
              Book Now
            </button>
          </div>
        </div>
        
        {/* Expandable section */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-blue-600 text-sm font-medium focus:outline-none"
          >
            {isExpanded ? 'Hide details' : 'Show details'}
            <svg 
              className={`ml-1 h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isExpanded && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Cabin</p>
                <p className="font-medium">{flight.cabinClass}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Available Seats</p>
                <p className="font-medium">{flight.availableSeats}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Baggage</p>
                <p className="font-medium">1 x 23kg</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Meal</p>
                <p className="font-medium">Included</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 