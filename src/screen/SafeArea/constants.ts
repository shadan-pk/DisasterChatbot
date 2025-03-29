import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const ASPECT_RATIO = width / height;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const MOCK_SAFE_AREAS = [
  {
    id: '1',
    name: 'Community Shelter',
    description: 'Emergency shelter with supplies',
    coordinate: { latitude: 37.785834, longitude: -122.406417 },
    type: 'shelter' as const
  },
  {
    id: '2',
    name: 'Central Hospital',
    description: '24/7 Emergency services',
    coordinate: { latitude: 37.780834, longitude: -122.412417 },
    type: 'hospital' as const
  },
  {
    id: '3',
    name: 'Police Station',
    description: 'City police headquarters',
    coordinate: { latitude: 37.775834, longitude: -122.408417 },
    type: 'police' as const
  }
];