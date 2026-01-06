import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TeamSelectionScreen from './src/screens/TeamSelectionScreen';
import CalendarScreen from './src/screens/CalendarScreen';

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeamSelection();
  }, []);

  const loadTeamSelection = async () => {
    try {
      const team = await AsyncStorage.getItem('selectedTeam');
      if (team) {
        setSelectedTeam(team);
      }
    } catch (error) {
      console.error('Error loading team selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamSelection = async (team) => {
    try {
      await AsyncStorage.setItem('selectedTeam', team);
      setSelectedTeam(team);
    } catch (error) {
      Alert.alert('Error', 'Failed to save team selection');
      console.error('Error saving team selection:', error);
    }
  };

  const handleChangeTeam = async () => {
    Alert.alert(
      'Change Team',
      'Are you sure you want to change your team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('selectedTeam');
              setSelectedTeam(null);
            } catch (error) {
              console.error('Error removing team selection:', error);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!selectedTeam) {
    return <TeamSelectionScreen onSelectTeam={handleTeamSelection} />;
  }

  return <CalendarScreen selectedTeam={selectedTeam} onChangeTeam={handleChangeTeam} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

