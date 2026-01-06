import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const TeamSelectionScreen = ({ onSelectTeam }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Team Scheduler</Text>
        <Text style={styles.subtitle}>Select your team</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.teamButton, styles.teamAButton]}
            onPress={() => onSelectTeam('A')}
            activeOpacity={0.8}
          >
            <Text style={styles.teamButtonText}>Tim A</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.teamButton, styles.teamBButton]}
            onPress={() => onSelectTeam('B')}
            activeOpacity={0.8}
          >
            <Text style={styles.teamButtonText}>Tim B</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your schedule will be displayed in the calendar view
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 50,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 20,
  },
  teamButton: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  teamAButton: {
    backgroundColor: '#4A90E2', // Blue
  },
  teamBButton: {
    backgroundColor: '#50C878', // Green
  },
  teamButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    marginTop: 50,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxWidth: 300,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TeamSelectionScreen;

