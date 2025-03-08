import { FIREBASE_AUTH, FIREBASE_DB } from '../../../../FirebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Message, EmergencyType, LocationData, UserData } from '../types';

export class FirestoreService {
  static async getUserData(): Promise<UserData> {
    try {
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (!userId) return {};

      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          firstName: userData.firstName,
          lastName: userData.lastName,
          policeStation: userData.policeStation,
          address: userData.address,
          phone: userData.phone,
        };
      }
      return {};
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {};
    }
  }

  static async saveMessage(message: Message): Promise<void> {
    try {
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (!userId) return;

      await addDoc(collection(FIREBASE_DB, 'users', userId, 'chatHistory'), {
        text: message.text,
        sender: message.sender,
        timestamp: serverTimestamp(),
        isEmergency: message.isEmergency || false,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }

  static subscribeToMessages(onMessagesUpdate: (messages: Message[]) => void): () => void {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return () => {};

    const q = query(
      collection(FIREBASE_DB, 'users', userId, 'chatHistory'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          text: data.text,
          sender: data.sender,
          timestamp: data.timestamp,
          isEmergency: data.isEmergency || false,
        });
      });
      
      if (loadedMessages.length > 0) {
        onMessagesUpdate(loadedMessages);
      }
    });

    return unsubscribe;
  }

  static async sendEmergencyAlert(
    emergencyType: EmergencyType,
    locationData: LocationData,
    userData: UserData
  ): Promise<string | null> {
    try {
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const userName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      
      // Create emergency alert in Firestore
      const alertRef = await addDoc(collection(FIREBASE_DB, 'emergencyAlerts'), {
        userId,
        userName,
        emergencyType: emergencyType.id,
        emergencyName: emergencyType.name,
        location: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.address,
        },
        userAddress: userData.address || '',
        userPhone: userData.phone || '',
        policeStation: userData.policeStation || '',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Update user status in Firestore
      await updateDoc(doc(FIREBASE_DB, 'users', userId), {
        lastEmergency: {
          type: emergencyType.id,
          alertId: alertRef.id,
          timestamp: serverTimestamp(),
        },
      });
      
      return alertRef.id;
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      return null;
    }
  }
}