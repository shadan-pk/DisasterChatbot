// import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = 'http://192.168.1.3:3000'; // Local server URL

// class SocketService {
//   private socket: Socket | null = null;

//   connect(): Socket {
//     this.socket = io(SOCKET_URL, {
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     this.socket.on('connect', () => {
//       console.log('Connected to server');
//       this.socket?.emit('register', 'user123'); // Optional
//     });

//     this.socket.on('connect_error', (error) => {
//       console.error('Connection error:', error);
//     });

//     return this.socket;
//   }

//   on(event: string, callback: (...args: any[]) => void): void {
//     if (this.socket) {
//       this.socket.on(event, callback);
//     }
//   }

//   disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//     }
//   }
// }

// export default new SocketService();

import { io, Socket } from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const SOCKET_URL = 'http://192.168.23.249:3001'; // Local server URL

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class SocketService {
  private socket: Socket | null = null;
  private expoPushToken: string | null = null;

  constructor() {
    this.registerForPushNotifications();
  }

  connect(): Socket {
    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      // Register with user ID and push token
      if (this.expoPushToken) {
        this.socket?.emit('register', { userId: 'user123', pushToken: this.expoPushToken });
      } else {
        this.socket?.emit('register', 'user123');
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Set up listener for alerts
    this.socket.on('alert', (message) => {
      // Show the notification
      // this.showLocalNotification(message);
    });

    return this.socket;
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  private async registerForPushNotifications(): Promise<void> {
    if (!Device.isDevice) {
      console.log('Physical device is required for Push Notifications');
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      // Get the token that uniquely identifies this device
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      let token;
      
      if (Platform.OS === 'android') {
        // On Android, use the token directly
        token = (await Notifications.getExpoPushTokenAsync({
          projectId,
        })).data;
      } else {
        // On iOS, get the token from Apple Push Notification service
        token = (await Notifications.getExpoPushTokenAsync({
          projectId,
        })).data;
      }

      this.expoPushToken = token;
      console.log('Expo Push Token:', token);
      
      // If already connected, send the token
      if (this.socket?.connected) {
        this.socket.emit('updatePushToken', { userId: 'user123', pushToken: token });
      }

      // Required for Android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('alerts', {
          name: 'App Alerts',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error('Error getting push token:', error);
    }
  }

  private async showLocalNotification(message: any): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title || "New Alert",
        body: message.content || message.text || JSON.stringify(message),
        sound: true,
        priority: 'high',
        data: { data: message },
      },
      trigger: null, // null means show immediately
    });
  }
}

export default new SocketService();