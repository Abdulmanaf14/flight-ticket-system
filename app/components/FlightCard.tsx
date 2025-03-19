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
    <div className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Airline and flight info */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-10 w-10 rounded-full bg-[#4169E1] flex items-center justify-center mr-4 shadow-sm">
            <span className="text-white font-bold text-sm">{flight.airline.substring(0, 2)}</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">{flight.airline}</p>
            <p className="font-medium text-gray-800">Flight {flight.flightNumber}</p>
          </div>
        </div>

        {/* Flight time and route */}
        <div className="flex-grow md:mx-6 mb-4 md:mb-0">
          <div className="flex items-center">
            <div className="text-right mr-3">
              <p className="font-bold text-lg text-gray-800">{departure.time}</p>
              <p className="text-gray-500 text-sm">{flight.origin}</p>
            </div>
            
            <div className="flex-grow mx-2 px-2">
              <div className="relative flex items-center justify-center">
                <div className="h-0.5 bg-gray-200 w-full"></div>
                <div className="absolute flex items-center justify-center">
                  <svg className="h-6 w-6 text-[#4169E1]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.998 21.995c.149 0 .291-.057.399-.158l-.399.158zm0 0c.108.101.25.158.399.158h9.868c.181 0 .343-.078.441-.214a.493.493 0 0 0 .064-.477l-5.128-12.377a.523.523 0 0 0-.32-.296.562.562 0 0 0-.443.04l-2.069 1.074c.059-.106-.059.106 0 0l2.069-1.074a.562.562 0 0 0-.443.04.523.523 0 0 0-.32.296L15.968 20.5l-3.169 1.338c-.283.12-.418.428-.301.694z" />
                    <path d="M11.002 2.005c-.149 0-.291.057-.399.158l.399-.158zm0 0c-.108-.101-.25-.158-.399-.158H.735c-.181 0-.343.078-.441.214a.493.493 0 0 0-.064.477l5.128 12.377c.053.128.172.234.32.296a.562.562 0 0 0 .443-.04l2.069-1.074c-.059.106.059-.106 0 0l-2.069 1.074a.562.562 0 0 0 .443-.04.523.523 0 0 0 .32-.296L8.032 3.5l3.169-1.338c.283-.12.418-.428.301-.694z" />
                  </svg>
                </div>
                <div className="absolute text-gray-500 text-xs whitespace-nowrap bottom-6">
                  {flight.duration}
                </div>
              </div>
            </div>
            
            <div className="text-left ml-3">
              <p className="font-bold text-lg text-gray-800">{arrival.time}</p>
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
          <p className="text-2xl font-bold text-[#4169E1]">${flight.price}</p>
          <p className="text-gray-500 text-sm">{flight.cabinClass}</p>
          <button 
            onClick={handleBooking}
            className="mt-2 bg-[#4169E1] hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>
      
      {/* Expandable section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-[#4169E1] hover:text-blue-600 text-sm font-medium transition-colors focus:outline-none"
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
              <p className="font-medium text-gray-800">{flight.cabinClass}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Available Seats</p>
              <p className="font-medium text-gray-800">{flight.availableSeats}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Baggage</p>
              <p className="font-medium text-gray-800">1 x 23kg</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Meal</p>
              <p className="font-medium text-gray-800">Included</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 