import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { isOfficeDay, getNextOfficeDay } from '../utils/scheduleLogic';
import { isHoliday, getHolidayName } from '../utils/holidays';

const CalendarScreen = ({ selectedTeam, onChangeTeam }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const currentDate = new Date();

  // Generate marked dates for the entire year
  const markedDates = useMemo(() => {
    const marked = {};
    const year = currentDate.getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      // Create date string manually to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      const dayOfWeek = date.getDay();
      
      // Mark weekends as disabled (greyed out)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        marked[dateString] = {
          disabled: true,
          disableTouchEvent: false,
          textColor: '#d9e1e8',
        };
      }
      // Mark holidays
      else if (isHoliday(date)) {
        marked[dateString] = {
          disabled: true,
          disableTouchEvent: false,
          textColor: '#d9e1e8',
        };
      }
      // Mark office days
      else if (isOfficeDay(date, selectedTeam)) {
        marked[dateString] = {
          marked: true,
          selectedColor: selectedTeam === 'A' ? '#4A90E2' : '#50C878',
          dotColor: selectedTeam === 'A' ? '#4A90E2' : '#50C878',
        };
      }
    }

    // Mark selected date
    if (marked[selectedDate]) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: selectedTeam === 'A' ? '#4A90E2' : '#50C878',
      };
    }

    return marked;
  }, [selectedTeam, currentDate, selectedDate]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const selectedDateObj = new Date(selectedDate + 'T12:00:00'); // Add time to avoid timezone issues
  const isSelectedDateOfficeDay = isOfficeDay(selectedDateObj, selectedTeam);
  const isSelectedDateHoliday = isHoliday(selectedDateObj);
  const holidayName = getHolidayName(selectedDateObj);
  const nextOfficeDay = getNextOfficeDay(new Date(), selectedTeam);

  const getDayName = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
    return days[date.getDay()];
  };

  const formatDate = (date) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Tim {selectedTeam}</Text>
          <TouchableOpacity
            style={styles.changeTeamButton}
            onPress={onChangeTeam}
          >
            <Text style={styles.changeTeamText}>Ganti Tim</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType={'simple'}
            disabledDaysIndexes={[]}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: selectedTeam === 'A' ? '#4A90E2' : '#50C878',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: selectedTeam === 'A' ? '#4A90E2' : '#50C878',
              selectedDotColor: '#ffffff',
              arrowColor: selectedTeam === 'A' ? '#4A90E2' : '#50C878',
              monthTextColor: '#2d4150',
              indicatorColor: selectedTeam === 'A' ? '#4A90E2' : '#50C878',
              textDayFontWeight: '400',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
            minDate={new Date(currentDate.getFullYear(), 0, 1).toISOString().split('T')[0]}
            maxDate={new Date(currentDate.getFullYear() + 1, 11, 31).toISOString().split('T')[0]}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Hari Terpilih</Text>
          <Text style={styles.infoCardDate}>
            {getDayName(selectedDateObj)}, {formatDate(selectedDateObj)}
          </Text>
          {isSelectedDateHoliday && holidayName && (
            <View style={styles.holidayContainer}>
              <Text style={styles.holidayText}>{holidayName}</Text>
            </View>
          )}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                isSelectedDateOfficeDay
                  ? styles.statusBadgeOffice
                  : isSelectedDateHoliday
                  ? styles.statusBadgeHoliday
                  : styles.statusBadgeHome,
              ]}
            >
              <Text style={styles.statusText}>
                {isSelectedDateHoliday
                  ? 'Hari Libur Nasional'
                  : isSelectedDateOfficeDay
                  ? 'Hari Kerja di Kantor'
                  : 'WFH'}
              </Text>
            </View>
          </View>
        </View>

        {nextOfficeDay && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Hari Kerja Berikutnya</Text>
            <Text style={styles.infoCardDate}>
              {getDayName(nextOfficeDay)}, {formatDate(nextOfficeDay)}
            </Text>
          </View>
        )}

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Keterangan:</Text>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: selectedTeam === 'A' ? '#4A90E2' : '#50C878' },
              ]}
            />
            <Text style={styles.legendText}>Hari kerja di kantor (Tim {selectedTeam})</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#fff3e0' }]} />
            <Text style={styles.legendText}>Hari libur nasional / Cuti bersama</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#d9e1e8' }]} />
            <Text style={styles.legendText}>Weekend</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  changeTeamButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  changeTeamText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  infoCardDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeOffice: {
    backgroundColor: '#e8f5e9',
  },
  statusBadgeHome: {
    backgroundColor: '#f5f5f5',
  },
  statusBadgeHoliday: {
    backgroundColor: '#fff3e0',
  },
  holidayContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  holidayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  legendContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});

export default CalendarScreen;

