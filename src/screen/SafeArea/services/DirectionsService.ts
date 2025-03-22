// import { SafeArea, RouteStep } from '../types';
// import { createSimulatedRoute, createSimulatedSteps } from '../utils/navigation';

// export class DirectionsService {
//   static async getDirections(
//     origin: { latitude: number; longitude: number },
//     destination: { latitude: number; longitude: number },
//     destinationName: string
//   ): Promise<{
//     route: Array<{ latitude: number; longitude: number }>;
//     steps: RouteStep[];
//   }> {
//     try {
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Create a simulated route with intermediate points
//       const simulatedRoute = createSimulatedRoute(origin, destination);
      
//       // Create simulated navigation steps
//       const simulatedSteps = createSimulatedSteps(destinationName);
      
//       // NOTE: In a real app, you would use the Google Directions API:
//       // const apiKey = 'YOUR_GOOGLE_API_KEY';
//       // const response = await fetch(
//       //   `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`
//       // );
//       // const data = await response.json();
//       // if (data.routes.length) {
//       //   const points = decodePolyline(data.routes[0].overview_polyline.points);
//       //   const steps = data.routes[0].legs[0].steps.map(step => ({
//       //     distance: step.distance.text,
//       //     duration: step.duration.text,
//       //     instruction: step.html_instructions.replace(/<[^>]*>/g, '')
//       //   }));
//       //   return { route: points, steps };
//       // }
      
//       return {
//         route: simulatedRoute,
//         steps: simulatedSteps
//       };
//     } catch (error) {
//       console.error('Error getting directions:', error);
//       throw error;
//     }
//   }
// }
import { SafeArea, Route*Step } from '../types';

export class DirectionsService {
  static async getDirections(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    destinationName: string
  ): Promise<{
    route: Array<{ latitude: number; longitude: number }>;
    steps: RouteStep[];
  }> {
    try {
      const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual Google API key
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;

      // Make the API request
      const response = await fetch(url);
      const data = await response.json();

      // Check if the API returned valid routes
      if (data.status !== 'OK' || !data.routes.length) {
        throw new Error(`Directions API error: ${data.status} - ${data.error_message || 'No routes found'}`);
      }

      // Extract the polyline points and decode them
      const encodedPolyline = data.routes[0].overview_polyline.points;
      const route = decodePolyline(encodedPolyline);

      // Extract navigation steps
      const steps = data.routes[0].legs[0].steps.map((step: any) => ({
        distance: step.distance.text,
        duration: step.duration.text,
        instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
      }));

      return {
        route,
        steps,
      };
    } catch (error) {
      console.error('Error getting directions:', error);
      throw error;
    }
  }
}

// Polyline decoding function (manual implementation)
function decodePolyline(encoded: string): Array<{ latitude: number; longitude: number }> {
  const points: Array<{ latitude: number; longitude: number }> = [];
  let index = 0,
    lat = 0,
    lng = 0;

  while (index < encoded.length) {
    let shift = 0,
      result = 0;
    let byte;

    // Decode latitude
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    // Decode longitude
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
}