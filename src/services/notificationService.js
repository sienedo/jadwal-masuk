import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { isOfficeDay } from '../utils/scheduleLogic';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permissions not granted');
    return false;
  }

  // Configure notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminder', {
      name: 'Reminder Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  return true;
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Schedule daily reminder notification at 6 AM
 * Schedules notifications only for office days in the next 90 days
 */
export const scheduleDailyReminder = async (team) => {
  // Cancel existing notifications first
  await cancelAllNotifications();

  if (!team) {
    return;
  }

  // Request permissions
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return;
  }

  // Schedule notifications for office days in the next 90 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let scheduledCount = 0;
  const maxDays = 90; // Schedule for next 90 days
  
  for (let i = 0; i < maxDays; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    
    if (isOfficeDay(checkDate, team)) {
      // Schedule notification for this office day at 6:00 AM
      const notificationDate = new Date(checkDate);
      notificationDate.setHours(6, 0, 0, 0);
      
      // Only schedule if the date is in the future
      if (notificationDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Jadwal Masuk',
            body: 'Hari ini kekantor',
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { team, date: checkDate.toISOString() },
          },
          trigger: notificationDate,
          identifier: `reminder-${checkDate.toISOString().split('T')[0]}`,
        });
        scheduledCount++;
      }
    }
  }
  
  console.log(`Scheduled ${scheduledCount} reminder notifications for office days`);
  
  // Also schedule a recurring daily notification that will reschedule itself
  // This ensures we always have notifications scheduled
  const dailyTrigger = {
    hour: 6,
    minute: 0,
    repeats: true,
  };
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Jadwal Masuk',
      body: 'Hari ini kekantor',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: { team, isDailyCheck: true },
    },
    trigger: dailyTrigger,
    identifier: 'daily-reminder-check',
  });
};

/**
 * Check if today is an office day and show notification if needed
 * This is called when notification is received
 */
export const checkAndShowReminder = async (team) => {
  if (!team) {
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  if (isOfficeDay(today, team)) {
    // Show notification immediately
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Jadwal Masuk',
        body: 'Hari ini kekantor',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Show immediately
    });
  }
};

/**
 * Test notification - schedule a notification at a specific time
 * @param {number} hours - Hour (0-23)
 * @param {number} minutes - Minute (0-59)
 * @param {string} team - Team A or B
 */
export const testNotification = async (hours, minutes, team) => {
  // Request permissions first
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return { success: false, message: 'Notification permissions not granted' };
  }

  // Calculate the test time
  const now = new Date();
  const testTime = new Date(now);
  testTime.setHours(hours, minutes, 0, 0);

  // If the time has passed today, schedule for tomorrow
  if (testTime <= now) {
    testTime.setDate(testTime.getDate() + 1);
  }

  // Schedule test notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Jadwal Masuk (Test)',
      body: 'Hari ini kekantor',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: { team, isTest: true },
    },
    trigger: testTime,
    identifier: 'test-notification',
  });

  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return { 
    success: true, 
    message: `Test notification scheduled for ${timeString}`,
    scheduledTime: testTime.toLocaleString('id-ID')
  };
};

/**
 * Show notification immediately (for testing)
 */
export const showTestNotificationNow = async (team) => {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return { success: false, message: 'Notification permissions not granted' };
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Jadwal Masuk (Test)',
      body: 'Hari ini kekantor',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: { team, isTest: true },
    },
    trigger: null, // Show immediately
    identifier: 'test-notification-now',
  });

  return { success: true, message: 'Test notification shown' };
};

