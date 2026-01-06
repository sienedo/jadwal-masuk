/**
 * Schedule Logic based on the pattern:
 * - Monday (Senin): Always Tim A
 * - Tuesday (Selasa): Always Tim A
 * - Wednesday (Rabu): Alternates (Week 1: A, Week 2: B, Week 3: A, Week 4: B, ...)
 * - Thursday (Kamis): Always Tim B
 * - Friday (Jum'at): Always Tim B
 */

import { isHoliday } from './holidays';

/**
 * Get the week number of the year for a given date
 * Week 1 starts on January 1st, counting weeks from the start of the year
 */
export const getWeekNumber = (date) => {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const daysDiff = Math.floor((date - yearStart) / (1000 * 60 * 60 * 24));
  return Math.floor(daysDiff / 7) + 1;
};

/**
 * Check if a given date is an office day for the selected team
 */
export const isOfficeDay = (date, team) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Weekend - No office days
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  // Check if it's a holiday - holidays override schedule
  if (isHoliday(date)) {
    return false;
  }
  
  const weekNumber = getWeekNumber(date);

  // Monday (1) - Always Tim A
  if (dayOfWeek === 1) {
    return team === 'A';
  }

  // Tuesday (2) - Always Tim A
  if (dayOfWeek === 2) {
    return team === 'A';
  }

  // Wednesday (3) - Alternates between A and B
  if (dayOfWeek === 3) {
    // Week 1, 3, 5, ... (odd weeks) = Tim A
    // Week 2, 4, 6, ... (even weeks) = Tim B
    const isOddWeek = weekNumber % 2 === 1;
    return (team === 'A' && isOddWeek) || (team === 'B' && !isOddWeek);
  }

  // Thursday (4) - Always Tim B
  if (dayOfWeek === 4) {
    return team === 'B';
  }

  // Friday (5) - Always Tim B
  if (dayOfWeek === 5) {
    return team === 'B';
  }

  return false;
};

/**
 * Get all office days for a given month and team
 */
export const getOfficeDaysForMonth = (year, month, team) => {
  const officeDays = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    if (isOfficeDay(date, team)) {
      officeDays.push(day);
    }
  }

  return officeDays;
};

/**
 * Get the next office day from a given date
 */
export const getNextOfficeDay = (fromDate, team) => {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + 1);

  // Look up to 14 days ahead
  for (let i = 0; i < 14; i++) {
    if (isOfficeDay(date, team)) {
      return new Date(date);
    }
    date.setDate(date.getDate() + 1);
  }

  return null;
};

