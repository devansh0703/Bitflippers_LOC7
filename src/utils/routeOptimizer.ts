const API_KEY = '77JkMkCLVXYqkGQ1TKnYHtjMDX0gkz2p';

const vehicleIcons = {
  Bike: 'https://img.icons8.com/emoji/48/motor-scooter.png',
  Van: 'https://img.icons8.com/fluency/48/van.png',
  Truck: 'https://img.icons8.com/fluency/48/truck.png',
};

export async function calculateRouteDetails(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  packageWeight: number,
  deadline: string
) {
  // Validate inputs
  if (
    !isValidCoordinate(startLat) ||
    !isValidCoordinate(startLng) ||
    !isValidCoordinate(endLat) ||
    !isValidCoordinate(endLng)
  ) {
    throw new Error(
      'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.'
    );
  }

  const url = `https://api.tomtom.com/routing/1/calculateRoute/${startLat},${startLng}:${endLat},${endLng}/json?key=${API_KEY}&traffic=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `TomTom API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found between the specified locations');
    }

    const summary = data.routes[0].summary;
    const distanceKm = summary.lengthInMeters / 1000;
    const etaMinutes = Math.round(summary.travelTimeInSeconds / 60);
    const trafficDelay = Math.round(summary.trafficDelayInSeconds / 60);

    // Get initial vehicle type based on distance and weight
    const vehicleType = selectOptimalVehicle(
      distanceKm,
      packageWeight,
      trafficDelay
    );

    // Check if the vehicle is allowed on this route
    const allowedVehicle = await checkVehicleRestrictions(
      startLat,
      startLng,
      endLat,
      endLng,
      vehicleType
    );

    // If vehicle is not allowed, get fallback vehicle
    const finalVehicleType = allowedVehicle
      ? vehicleType
      : fallbackVehicleChoice(vehicleType);

    const co2Emissions = estimateCO2Emissions(finalVehicleType, distanceKm);
    const urgencyScore = calculateUrgencyScore(etaMinutes, deadline);
    const price = calculatePrice(
      finalVehicleType,
      distanceKm,
      packageWeight,
      trafficDelay
    );

    // Get traffic alert if there's significant delay
    const trafficAlert =
      trafficDelay > 10
        ? `Heavy traffic detected! Delay of ${trafficDelay} minutes.`
        : undefined;

    return {
      distance: Number(distanceKm.toFixed(2)),
      eta: etaMinutes,
      trafficDelay: trafficDelay,
      vehicleType: finalVehicleType,
      co2Emissions: Number(co2Emissions.toFixed(2)),
      urgencyScore: urgencyScore,
      price: Number(price.toFixed(2)),
      allowedVehicle,
      trafficAlert,
      vehicleIcon: vehicleIcons[finalVehicleType],
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to calculate route details'
    );
  }
}

async function checkVehicleRestrictions(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  vehicleType: string
): Promise<boolean> {
  const restrictionUrl = `https://api.tomtom.com/traffic/services/4/incidentDetails/s2/${startLat},${startLng},${endLat},${endLng}/json?key=${API_KEY}`;

  try {
    const response = await fetch(restrictionUrl);
    const data = await response.json();

    if (data.incidents) {
      for (let incident of data.incidents) {
        if (
          incident.properties.vehicleType &&
          !incident.properties.vehicleType.includes(vehicleType)
        ) {
          console.warn(`🚨 ${vehicleType} is restricted on this route!`);
          return false;
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Error checking vehicle restrictions:', error);
    return true;
  }
}

function fallbackVehicleChoice(
  currentVehicle: string
): 'Bike' | 'Van' | 'Truck' {
  const fallbackOptions = {
    Truck: 'Van',
    Van: 'Bike',
    Bike: 'Bike',
  } as const;
  return fallbackOptions[currentVehicle as keyof typeof fallbackOptions];
}

function calculatePrice(
  vehicleType: string,
  distance: number,
  weight: number,
  trafficDelay: number
): number {
  const baseFare = 50;
  const perKmRates = { Bike: 5, Van: 10, Truck: 15 };
  const weightSurcharge = weight > 10 ? 20 : weight >= 5 ? 10 : 0;
  const trafficSurcharge = trafficDelay > 10 ? (trafficDelay - 10) * 2 : 0;

  return (
    baseFare +
    perKmRates[vehicleType as keyof typeof perKmRates] * distance +
    weightSurcharge +
    trafficSurcharge
  );
}

function isValidCoordinate(coord: number): boolean {
  return (
    !isNaN(coord) &&
    isFinite(coord) &&
    Math.abs(coord) <= (coord % 1 === 0 ? 180 : 90)
  );
}

function selectOptimalVehicle(
  distance: number,
  weight: number,
  trafficDelay: number
): 'Bike' | 'Van' | 'Truck' {
  if (distance < 10 && weight < 5 && trafficDelay > 15) return 'Bike';
  if (distance < 50 && weight < 20) return 'Van';
  return 'Truck';
}

function estimateCO2Emissions(vehicleType: string, distance: number): number {
  const co2Rates = { Bike: 0.1, Van: 0.2, Truck: 0.5 };
  return co2Rates[vehicleType as keyof typeof co2Rates] * distance;
}

function calculateUrgencyScore(eta: number, deadline: string): number {
  const timeRemaining =
    (new Date(deadline).getTime() - new Date().getTime()) / 60000;
  return Math.round(timeRemaining - eta);
}
