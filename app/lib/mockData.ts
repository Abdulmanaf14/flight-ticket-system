export interface Flight {
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
}

// Helper function to add hours to a date
const addHours = (date: Date, hours: number): Date => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

// Generate a flight between two airports
export const generateFlight = (
  origin: string,
  destination: string,
  departureDate: string,
  cabinClass: string,
  index: number
): Flight => {
  const airlines = ['Sky Airlines', 'Global Airways', 'Frontier Jets', 'Pacific Air', 'Star Express'];
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  
  // Generate flight number with airline code prefix and 3-4 digit number
  const airlineCode = airline.split(' ')[0].substring(0, 2).toUpperCase();
  const flightNum = Math.floor(1000 + Math.random() * 9000);
  const flightNumber = `${airlineCode}${flightNum}`;
  
  // Generate departure time (between 6 AM and 10 PM)
  const deptDate = new Date(departureDate);
  const hour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
  const minute = Math.floor(Math.random() * 60);
  deptDate.setHours(hour, minute);
  
  // Flight duration between 1 and 12 hours depending on route
  const durationHours = 1 + Math.floor(Math.random() * 11);
  const durationMinutes = Math.floor(Math.random() * 60);
  
  // Generate arrival time
  const arrivalTime = addHours(deptDate, durationHours + (durationMinutes / 60));
  
  // Format duration string
  const durationStr = `${durationHours}h ${durationMinutes}m`;
  
  // Generate price based on cabin class and a random factor
  let basePrice = 100 + Math.floor(Math.random() * 200); // Base economy price
  switch (cabinClass) {
    case 'Premium Economy':
      basePrice *= 1.5;
      break;
    case 'Business':
      basePrice *= 2.5;
      break;
    case 'First':
      basePrice *= 4;
      break;
  }
  
  // Round price to nearest $10
  const price = Math.round(basePrice / 10) * 10;
  
  // Random available seats
  const availableSeats = 1 + Math.floor(Math.random() * 30);
  
  return {
    id: `${origin}-${destination}-${deptDate.getTime()}-${index}`,
    flightNumber,
    airline,
    origin,
    destination,
    departureTime: deptDate.toISOString(),
    arrivalTime: arrivalTime.toISOString(),
    duration: durationStr,
    price,
    availableSeats,
    cabinClass,
  };
};

// Generate a list of flights based on search parameters
export const searchFlights = (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  cabinClass: string = 'Economy',
  numPassengers: number = 1
): { departureFlights: Flight[], returnFlights: Flight[] | null } => {
  const numFlights = 5 + Math.floor(Math.random() * 6); // 5-10 flights
  
  // Generate departure flights
  const departureFlights = Array.from({ length: numFlights }, (_, i) => 
    generateFlight(origin, destination, departureDate, cabinClass, i)
  ).sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
  
  // Generate return flights if round trip
  let returnFlights = null;
  if (returnDate) {
    returnFlights = Array.from({ length: numFlights }, (_, i) => 
      generateFlight(destination, origin, returnDate, cabinClass, i)
    ).sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
  }
  
  return { departureFlights, returnFlights };
}; 