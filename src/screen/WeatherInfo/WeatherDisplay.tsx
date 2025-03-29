// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import * as Location from 'expo-location';
// import { API_CONFIG } from './api/config';
// // import { Icon } from 'react-native-vector-icons/Icon';
// import Ionicons from '@expo/vector-icons/Ionicons';

// const API_KEY = API_CONFIG.API_KEY; // Replace with your actual OpenWeatherMap API key

// const WeatherDisplay = () => {
//   const [weatherData, setWeatherData] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchWeather = async () => {
//       try {
//         // Request location permissions
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//           setError('Permission to access location was denied');
//           return;
//         }

//         // Get current location
//         let location = await Location.getCurrentPositionAsync({});
//         const { latitude, longitude } = location.coords;

//         // Fetch weather data from OpenWeatherMap API
//         const response = await fetch(
//           `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
//         );
//         const data = await response.json();

//         if (response.ok) {
//           setWeatherData(data);
//         } else {
//           setError('Failed to fetch weather data');
//         }
//       } catch (err) {
//         setError('An error occurred while fetching weather data');
//       }
//     };

//     fetchWeather();
//   }, []);

//   // Handle loading and error states
//   if (error) {
//     return <Text style={styles.errorText}>{error}</Text>;
//   }

//   if (!weatherData) {
//     return <Text style={styles.loadingText}>Loading weather...</Text>;
//   }

  

  // return (
//     <View style={styles.container}>
//       {/* Main Weather Info */}
//       <Ionicons
//         name={
//           weatherData.weather[0].main === 'Clouds'
//             ? 'cloud-outline'
//             : weatherData.weather[0].main === 'Rain'
//             ? 'rainy-outline'
//             : 'sunny-outline'
//         }
//         size={50}
//         color="#fff"
//         style={{ marginBottom: 10 }}
//       />
//       <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
//       <Text style={styles.condition}>{weatherData.weather[0].description}</Text>
//       <Text style={styles.location}>{weatherData.name}, {weatherData.sys.country}</Text>

//       {/* Additional Details */}
//       <View style={styles.detailsContainer}>
//         <View style={styles.detailCard}>
//           <Text style={styles.detailValue}>{Math.round(weatherData.main.feels_like)}°C</Text>
//           <Text style={styles.detailLabel}>Feels Like</Text>
//         </View>
//         <View style={styles.detailCard}>
//           <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
//           <Text style={styles.detailLabel}>Humidity</Text>
//         </View>
//       </View>
//       <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
//   <Text style={styles.refreshText}>{refreshing ? 'Refreshing...' : 'Refresh'}</Text>
// </TouchableOpacity>
//     </View>
  // );
// };
// 
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#333',
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 10,
//     marginHorizontal: 20,
//     alignItems: 'center',
//   },
//   temperature: {
//     fontSize: 40,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   condition: {
//     fontSize: 18,
//     color: '#fff',
//     textTransform: 'capitalize',
//     marginVertical: 5,
//   },
//   location: {
//     fontSize: 16,
//     color: '#fff',
//   },
//   detailsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 10,
//   },
//   detailCard: {
//     backgroundColor: '#1E90FF', // Blue background like the image
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//     width: '45%',
//   },
//   detailValue: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#fff',
//   },
//   loadingText: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   refreshButton: {
//     backgroundColor: '#1E90FF',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   refreshText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default WeatherDisplay;

// function fetchWeather() {
//   throw new Error('Function not implemented.');
// }
