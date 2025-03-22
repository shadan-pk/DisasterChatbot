import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteStep } from '../types';

interface NavigationInstructionsProps {
  destinationName: string;
  steps: RouteStep[];
  onStopNavigation: () => void;
}

const NavigationInstructions: React.FC<NavigationInstructionsProps> = ({
  destinationName,
  steps,
  onStopNavigation
}) => {
  return (
    <View style={styles.navigationContainer}>
      <View style={styles.navigationHeader}>
        <Text style={styles.navigationTitle}>
          Navigating to {destinationName}
        </Text>
        <TouchableOpacity
          style={styles.stopButton}
          onPress={onStopNavigation}
        >
          <Text style={styles.stopButtonText}>End Navigation</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepInstruction}>{step.instruction}</Text>
              <Text style={styles.stepDetails}>
                {step.distance} • {step.duration}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    paddingBottom: 15,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  stopButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepsContainer: {
    maxHeight: 200,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stepIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 14,
    fontWeight: '500',
  },
  stepDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default NavigationInstructions;