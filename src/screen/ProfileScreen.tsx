// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { doc, getDoc, DocumentData } from 'firebase/firestore';
// import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'; // Updated import to match your config
// import { Ionicons } from '@expo/vector-icons';

// // Define the user profile interface
// interface UserProfile extends DocumentData {
//   id: string;
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   phoneNumber?: string;
//   location?: string;
//   policeStation?: string;
//   photoURL?: string;
// }

// const ProfileScreen = () => {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchUserProfile = async () => {
//     try {
//       // Get current user UID from Firebase Auth
//       const uid = FIREBASE_AUTH.currentUser?.uid;
      
//       if (!uid) {
//         throw new Error('User not authenticated');
//       }
      
//       // Fetch user data from Firestore
//       const userDocRef = doc(FIREBASE_DB, 'users', uid);
//       const userDocSnap = await getDoc(userDocRef);
      
//       if (userDocSnap.exists()) {
//         // Create a new object with the id and spread the data
//         const userData: UserProfile = {
//           id: userDocSnap.id,
//           ...userDocSnap.data()
//         };
//         setUserProfile(userData);
//       } else {
//         console.log('uid:', uid);
//         throw new Error('User profile not found');
//       }
//     } catch (err) {
//       console.error('Error fetching user profile:', err);
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
//         <Text style={styles.errorText}>Error: {error}</Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => {
//             setLoading(true);
//             setError(null);
//             // Retry fetching profile after delay
//             setTimeout(() => {
//               fetchUserProfile();
//             }, 1000);
//           }}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar style="auto" />
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.headerContainer}>
//           <Image 
//             source={
//               userProfile?.photoURL 
//                 ? { uri: userProfile.photoURL } 
//                 : require('../../assets/favicon.png') // Make sure to add this image
//             } 
//             style={styles.profileImage} 
//           />
//           <Text style={styles.name}>
//             {userProfile?.firstName || ''} {userProfile?.lastName || ''}
//           </Text>
//           <Text style={styles.email}>{userProfile?.email || 'No email provided'}</Text>
//         </View>

//         <View style={styles.infoSection}>
//           <Text style={styles.sectionTitle}>Personal Information</Text>
          
//           <InfoItem 
//             icon="person-outline" 
//             label="First Name" 
//             value={userProfile?.firstName || 'Not provided'} 
//           />
          
//           <InfoItem 
//             icon="person-outline" 
//             label="Last Name" 
//             value={userProfile?.lastName || 'Not provided'} 
//           />
          
//           <InfoItem 
//             icon="call-outline" 
//             label="Phone Number" 
//             value={userProfile?.phoneNumber || 'Not provided'} 
//           />
          
//           <InfoItem 
//             icon="location-outline" 
//             label="Location" 
//             value={userProfile?.location || 'Not provided'} 
//           />
          
//           <InfoItem 
//             icon="business-outline" 
//             label="Police Station" 
//             value={userProfile?.policeStation || 'Not provided'} 
//           />
//         </View>

//         <TouchableOpacity style={styles.editButton}>
//           <Text style={styles.editButtonText}>Edit Profile</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // Define props interface for InfoItem
// interface InfoItemProps {
//   icon: keyof typeof Ionicons.glyphMap;
//   label: string;
//   value: string;
// }

// // Helper component for displaying profile info items
// const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
//   <View style={styles.infoItem}>
//     <Ionicons name={icon} size={20} color="#555" />
//     <View style={styles.infoContent}>
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={styles.infoValue}>{value}</Text>
//     </View>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   errorText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555',
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#007AFF',
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   headerContainer: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ececec',
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 15,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   email: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 5,
//   },
//   infoSection: {
//     backgroundColor: 'white',
//     padding: 20,
//     marginVertical: 10,
//     borderRadius: 10,
//     marginHorizontal: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 15,
//     color: '#333',
//   },
//   infoItem: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ececec',
//   },
//   infoContent: {
//     flex: 1,
//     marginLeft: 15,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#888',
//   },
//   infoValue: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//     marginTop: 4,
//   },
//   editButton: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginHorizontal: 15,
//     marginVertical: 20,
//   },
//   editButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   }
// });

// export default ProfileScreen;
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { collection, getDocs, doc, getDoc, DocumentData } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'; // Using your Firebase config
import { Ionicons } from '@expo/vector-icons';

// Define the user profile interface
interface UserProfile extends DocumentData {
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    photoURL?: string;
  }

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

//   const fetchUserProfile = async () => {
//     try {
//       // Get current user UID from Firebase Auth
//       const uid = FIREBASE_AUTH.currentUser?.uid;
      
//       if (!uid) {
//         throw new Error('User not authenticated');
//       }
      
//       // Directly access the document with user's UID in the users collection
//       const userDocRef = doc(FIREBASE_DB, 'users', uid);
//       const userDocSnap = await getDoc(userDocRef);
      
//       if (userDocSnap.exists()) {
//         // Get the user data from the document
//         const userData: UserProfile = {
//           id: userDocSnap.id,
//           ...userDocSnap.data(),
//           // Convert Firestore timestamp to JavaScript Date
//           createdAt: userDocSnap.data().createdAt?.toDate ? 
//             userDocSnap.data().createdAt.toDate() : 
//             userDocSnap.data().createdAt,
//         };
//         setUserProfile(userData);
//       } else {
//         console.log('uid:', uid);
//         throw new Error('User profile not found');
//       }
//     } catch (err) {
//       console.error('Error fetching user profile:', err);
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

// Add this function inside your ProfileScreen component
const fetchUserProfile = async () => {
    try {
      const uid = FIREBASE_AUTH.currentUser?.uid;
      
      if (!uid) {
        throw new Error('User not authenticated');
      }
      
      const userDocRef = doc(FIREBASE_DB, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const profile: UserProfile = {
          uid: userDocSnap.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          photoURL: userData.photoURL
        };
        
        setUserProfile(profile);
      } else {
        console.log('No user document found for uid:', uid);
        throw new Error('User profile not found');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  // Add this useEffect hook to fetch the profile when component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            // Retry fetching profile after delay
            setTimeout(() => {
              fetchUserProfile();
            }, 1000);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          {/* <Image 
            source={
              userProfile?.photoURL 
                ? { uri: userProfile.photoURL } 
                : require('../../assets/default-avatar.png') // Make sure to add this image
            } 
            style={styles.profileImage} 
          /> */}
          <Text style={styles.name}>
            {userProfile?.firstName || ''} {userProfile?.lastName || ''}
          </Text>
          <Text style={styles.email}>{userProfile?.email || 'No email provided'}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <InfoItem 
            icon="person-outline" 
            label="First Name" 
            value={userProfile?.firstName || 'Not provided'} 
          />
          
          <InfoItem 
            icon="person-outline" 
            label="Last Name" 
            value={userProfile?.lastName || 'Not provided'} 
          />
          
          <InfoItem 
            icon="call-outline" 
            label="Phone Number" 
            value={userProfile?.phone || 'Not provided'} 
          />
          
          <InfoItem 
            icon="location-outline" 
            label="Location" 
            value={userProfile?.address || 'Not provided'} 
          />
          
            <InfoItem 
                icon="business-outline" 
                label="Police Station" 
                value={userProfile?.policeStation || 'Not provided'}
            />

        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Define props interface for InfoItem
interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
}

// Helper component for displaying profile info items
const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={20} color="#555" />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default ProfileScreen;