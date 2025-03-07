import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type OfflineHelpScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'OfflineHelp'>;
};

const OfflineHelpScreen: React.FC<OfflineHelpScreenProps> = ({ navigation }) => {
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Offline Help</Text>
      <TouchableOpacity 
        style={GlobalStyles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={GlobalStyles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfflineHelpScreen;


