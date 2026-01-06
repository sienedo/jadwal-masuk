import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TeamSelectionScreen from './src/screens/TeamSelectionScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import { scheduleDailyReminder, checkAndShowReminder } from './src/services/notificationService';
import { isOfficeDay } from './src/utils/scheduleLogic';

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    loadTeamSelection();
    setupNotifications();
    
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      scheduleDailyReminder(selectedTeam);
    } else {
      // Cancel notifications if no team selected
      scheduleDailyReminder(null);
    }
  }, [selectedTeam]);

  const setupNotifications = () => {
    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      const notificationData = notification.request.content.data;
      
      // If this is the daily check notification, verify it's an office day
      if (notificationData?.isDailyCheck) {
        const team = await AsyncStorage.getItem('selectedTeam');
        if (team) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Only show if it's actually an office day
          if (isOfficeDay(today, team)) {
            console.log('Reminder notification received for office day');
            // Notification will be shown automatically
          } else {
            // Cancel the notification if it's not an office day
            try {
              await Notifications.dismissNotificationAsync(notification.request.identifier);
            } catch (error) {
              console.log('Could not dismiss notification:', error);
            }
          }
        }
      } else {
        // For specific date notifications, they're already scheduled for office days only
        console.log('Reminder notification received for scheduled office day');
      }
    });

    // Listen for notification responses (when user taps notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
    });
  };

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

