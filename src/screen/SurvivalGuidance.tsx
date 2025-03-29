// SurvivalGuidance.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types for disaster guidance content
interface SurvivalGuide {
  title: string;
  preparation: string[];
  during: string[];
  after: string[];
}

interface DisasterType {
  id: string;
  name: string;
  guide: SurvivalGuide;
  icon: keyof typeof Ionicons.glyphMap;
}

const DISASTER_GUIDES: DisasterType[] = [
  {
    id: 'flood',
    name: 'Flood',
    icon: 'water',
    guide: {
      title: 'Flood Survival Guide',
      preparation: [
        'Elevate appliances above flood levels',
        'Store emergency supplies (water, food, first aid)',
        'Know your evacuation routes',
        'Prepare a family communication plan',
      ],
      during: [
        'Move to higher ground immediately',
        'Avoid walking through moving water',
        'Stay away from power lines',
        'Listen to emergency broadcasts',
      ],
      after: [
        'Wait for official all-clear signal',
        'Avoid floodwater (may be contaminated)',
        'Document damage for insurance',
        'Check for structural damage before entering buildings',
      ],
    },
  },
  {
    id: 'earthquake',
    name: 'Earthquake',
    icon: 'earth',
    guide: {
      title: 'Earthquake Survival Guide',
      preparation: [
        'Secure heavy objects',
        'Practice Drop, Cover, and Hold On',
        'Prepare an emergency kit',
        'Identify safe spots in each room',
      ],
      during: [
        'Drop to hands and knees',
        'Cover your head and neck',
        'Hold on until shaking stops',
        'Stay away from windows',
      ],
      after: [
        'Expect aftershocks',
        'Check for injuries and damage',
        'Be careful of fallen power lines',
        'Use stairs, avoid elevators',
      ],
    },
  },
  {
    id: 'fire',
    name: 'Fire',
    icon: 'flame',
    guide: {
      title: 'Fire Survival Guide',
      preparation: [
        'Install smoke alarms',
        'Create a fire escape plan',
        'Keep fire extinguishers handy',
        'Identify two escape routes per room',
      ],
      during: [
        'Stay low to avoid smoke',
        'Check doors for heat before opening',
        'Use your escape plan',
        'Never go back inside',
      ],
      after: [
        'Call emergency services',
        'Get medical help if needed',
        'Stay out until authorities say it’s safe',
        'Contact insurance provider',
      ],
    },
  },
  {
    id: 'landslide',
    name: 'Landslide',
    icon: 'warning',
    guide: {
      title: 'Landslide Survival Guide',
      preparation: [
        'Learn warning signs',
        'Avoid building near steep slopes',
        'Plan evacuation routes',
        'Monitor weather forecasts',
      ],
      during: [
        'Move away from the path',
        'Curl into a ball if escape isn’t possible',
        'Listen for unusual sounds',
        'Stay alert for secondary slides',
      ],
      after: [
        'Stay away from slide area',
        'Help injured persons',
        'Report to authorities',
        'Watch for flooding',
      ],
    },
  },
];

const SurvivalGuidance: React.FC = () => {
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterType | null>(null);

  const renderGuideSection = (title: string, items: string[], icon: string) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={24} color="#FF6B6B" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.sectionItemContainer}>
          <Ionicons name="checkmark-circle" size={18} color="#4ECDC4" />
          <Text style={styles.sectionItem}>{item}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Survival Guidance</Text>
        <Ionicons name="shield-checkmark" size={28} color="#4ECDC4" />
      </View>

      {!selectedDisaster ? (
        <ScrollView style={styles.disasterList}>
          {DISASTER_GUIDES.map((disaster) => (
            <TouchableOpacity
              key={disaster.id}
              style={styles.disasterItem}
              onPress={() => setSelectedDisaster(disaster)}
            >
              <Ionicons name={disaster.icon} size={32} color="#FF6B6B" />
              <Text style={styles.disasterItemText}>{disaster.name}</Text>
              <Ionicons name="chevron-forward" size={24} color="#4ECDC4" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.guideContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedDisaster(null)}
          >
            <Ionicons name="chevron-back" size={24} color="#4ECDC4" />
            <Text style={styles.backButtonText}>Back to List</Text>
          </TouchableOpacity>
          <View style={styles.guideHeader}>
            <Ionicons name={selectedDisaster.icon} size={40} color="#FF6B6B" />
            <Text style={styles.guideTitle}>{selectedDisaster.guide.title}</Text>
          </View>
          {renderGuideSection('Preparation', selectedDisaster.guide.preparation, 'construct')}
          {renderGuideSection('During', selectedDisaster.guide.during, 'alert-circle')}
          {renderGuideSection('After', selectedDisaster.guide.after, 'healing')}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  disasterList: {
    paddingHorizontal: 20,
  },
  disasterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disasterItemText: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  guideContent: {
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4ECDC4',
    marginLeft: 5,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  guideTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 15,
  },
  section: {
    backgroundColor: '#16213E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  sectionItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  sectionItem: {
    fontSize: 16,
    color: '#E0E0E0',
    marginLeft: 10,
    flex: 1,
  },
});

export default SurvivalGuidance;