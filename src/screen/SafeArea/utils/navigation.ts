import { RouteStep } from '../types';

export const createSimulatedRoute = (
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number }
): Array<{ latitude: number; longitude: number }> => {
  const points = [];
  const steps = 8; // Number of points in the route
  
  for (let i = 0; i <= steps; i++) {
    const lat = start.latitude + (end.latitude - start.latitude) * (i / steps);
    const lng = start.longitude + (end.longitude - start.longitude) * (i / steps);
    
    // Add some randomness to make it look like a real route
    const jitter = i > 0 && i < steps ? (Math.random() - 0.5) * 0.001 : 0;
    
    points.push({
      latitude: lat + jitter,
      longitude: lng + jitter
    });
  }
  
  return points;
};

export const createSimulatedSteps = (destinationName: string): RouteStep[] => {
  return [
    {
      distance: '0.3 miles',
      duration: '4 mins',
      instruction: 'Head north on Market St'
    },
    {
      distance: '0.5 miles',
      duration: '7 mins',
      instruction: 'Turn right onto Montgomery St'
    },
    {
      distance: '0.2 miles',
      duration: '3 mins',
      instruction: `Arrive at destination: ${destinationName}`
    }
  ];
};