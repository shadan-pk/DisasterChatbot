// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Alert as RNAlert } from 'react-native';
// import socketService from '../../../services/socketService'; // Adjust path to your socketService.ts
// import AlertItem from '../components/AlertItem'; // Adjust path

// interface Alert {
//   id: number;
//   title: string;
//   message: string;
//   type: string;
//   timestamp: string;
// }

// const AlertScreen: React.FC = () => {
//   const [alerts, setAlerts] = useState<Alert[]>([]);

//   useEffect(() => {
//     // Connect to Socket.IO server
//     const socket = socketService.connect();

//     // Listen for incoming alerts
//     socketService.on('alert', (alert: Alert) => {
//       setAlerts((prevAlerts) => [alert, ...prevAlerts.slice(0, 49)]); // Limit to 50 alerts
//       RNAlert.alert(
//         alert.title,
//         alert.message,
//         [{ text: 'OK', style: 'cancel' }],
//         { cancelable: true }
//       );
//     });

//     // Handle connection errors (optional logging)
//     socketService.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       RNAlert.alert('Connection Error', 'Unable to connect to alert server');
//     });

//     // Cleanup on unmount
//     return () => {
//       socketService.disconnect();
//     };
//   }, []);

//   const renderAlert = ({ item }: { item: Alert }) => <AlertItem alert={item} />;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Disaster Alerts</Text>
//       <FlatList
//         data={alerts}
//         renderItem={renderAlert}
//         keyExtractor={(item) => item.id.toString()}
//         ListEmptyComponent={<Text style={styles.emptyText}>No alerts received yet</Text>}
//         inverted // Latest alerts appear at the bottom (chat-like)
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     paddingVertical: 20,
//     backgroundColor: '#f5f5f5',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   listContent: {
//     padding: 15,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default AlertScreen;
// AlertScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAlerts } from '../../AlertContext'; // Adjust path
import AlertItem from '../components/AlertItem'; // Adjust path

interface Alert {
  id: number;
  title: string;
  message: string;
  type: string;
  timestamp: string;
}

const AlertScreen: React.FC = () => {
  const { alerts } = useAlerts();

  const renderAlert = ({ item }: { item: Alert }) => <AlertItem alert={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Disaster Alerts</Text>
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No alerts received yet</Text>}
        inverted // Latest alerts appear at the bottom (chat-like)
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  listContent: {
    padding: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AlertScreen;