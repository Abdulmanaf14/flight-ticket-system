'use client';

import { useEffect, useState } from 'react';
import { type FlightStatus } from '../api/flight-status/route';

interface FlightStatusUpdateProps {
  flight_number: string;
  status: FlightStatus;
  message: string;
  timestamp: string;
  delay_minutes?: number;
}

export default function FlightStatus({ flightNumber }: { flightNumber: string }) {
  const [statusUpdate, setStatusUpdate] = useState<FlightStatusUpdateProps | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!flightNumber) return;
    
    let eventSource: EventSource | null = null;
    
    try {
      // Connect to the SSE endpoint
      eventSource = new EventSource(`/api/flight-status?flight=${flightNumber}`);
      
      // Handle successful connection
      eventSource.onopen = () => {
        setConnected(true);
        setError(null);
      };
      
      // Handle incoming messages
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setStatusUpdate(data);
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };
      
      // Handle errors
      eventSource.onerror = (err) => {
        console.error('SSE connection error:', err);
        setError('Connection to flight status updates lost. Trying to reconnect...');
        setConnected(false);
        
        // Close the connection on error
        if (eventSource) {
          eventSource.close();
        }
      };
    } catch (err) {
      console.error('Error setting up SSE:', err);
      setError('Could not connect to flight status updates');
    }
    
    // Clean up
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [flightNumber]);
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-2">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }
  
  if (!statusUpdate) {
    return (
      <div className="bg-white/5 rounded-md p-4 mt-2 border border-white/10 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
      </div>
    );
  }
  
  // Status color based on flight status
  const getStatusColor = (status: FlightStatus) => {
    switch (status) {
      case 'on-time':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'boarding':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-air':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'landed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Icon based on flight status
  const getStatusIcon = (status: FlightStatus) => {
    switch (status) {
      case 'on-time':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'boarding':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'in-air':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 00-.725-.962l-5-1.429a1 1 0 01.725-1.962l5 1.429a1 1 0 00.725-.038l5-1.429a1 1 0 011.444.962l-7 14z" />
          </svg>
        );
      case 'landed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'delayed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  const statusColorClass = getStatusColor(statusUpdate.status);
  const formattedTime = new Date(statusUpdate.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`border rounded-md p-3 mt-2 ${statusColorClass}`}>
      <div className="flex items-center">
        <div className="mr-2">
          {getStatusIcon(statusUpdate.status)}
        </div>
        <div>
          <div className="font-medium">
            {statusUpdate.status.charAt(0).toUpperCase() + statusUpdate.status.slice(1)}
            {statusUpdate.delay_minutes && ` • ${statusUpdate.delay_minutes} min delay`}
          </div>
          <div className="text-sm">
            {statusUpdate.message}
          </div>
          <div className="text-xs mt-1">
            Last updated: {formattedTime}
            {connected && (
              <span className="inline-flex ml-2 items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Live
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 