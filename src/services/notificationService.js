import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { isOfficeDay } from '../utils/scheduleLogic';

// Konfigurasi handler notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Minta izin notifikasi
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

  // Konfigurasi channel Android
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
 * Batalkan semua notifikasi terjadwal
 */
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Jadwalkan notifikasi jam 06:00 hanya pada hari kerja kantor
 * untuk tim yang dipilih (Tim A / Tim B) untuk 90 hari ke depan.
 */
export const scheduleDailyReminder = async (team) => {
  // Hapus semua jadwal lama
  await cancelAllNotifications();

  if (!team) return;

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDays = 90; // 3 bulan ke depan
  let scheduledCount = 0;

  for (let i = 0; i < maxDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Hanya hari kerja kantor sesuai tim (sudah exclude weekend & libur)
    if (!isOfficeDay(date, team)) continue;

    const notificationDate = new Date(date);
    notificationDate.setHours(6, 0, 0, 0); // jam 06:00 lokal

    // Jangan jadwalkan yang sudah lewat
    if (notificationDate <= now) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Jadwal Masuk',
        body: 'Hari ini kekantor',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: notificationDate,
    });

    scheduledCount++;
  }

  console.log(`Scheduled ${scheduledCount} reminder notifications for office days`);
};

