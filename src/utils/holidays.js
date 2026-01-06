/**
 * Indonesian Public Holidays and Cuti Bersama for 2026
 * Based on Bank Indonesia calendar
 */

export const holidays2026 = [
  // Hari Libur Nasional
  '2026-01-01', // Tahun Baru 2026 Masehi
  '2026-01-16', // Isra Mikraj Nabi Muhammad SAW
  '2026-02-17', // Tahun Baru Imlek 2577 Kongzili
  '2026-03-19', // Hari Suci Nyepi Tahun Baru Saka 1948
  '2026-03-21', // Hari Raya Idul Fitri 1447 Hijriah
  '2026-03-22', // Hari Raya Idul Fitri 1447 Hijriah
  '2026-04-03', // Wafat Yesus Kristus
  '2026-04-05', // Kebangkitan Yesus Kristus (Paskah)
  '2026-05-01', // Hari Buruh Internasional
  '2026-05-14', // Kenaikan Yesus Kristus
  '2026-05-27', // Hari Raya Idul Adha 1447 Hijriah
  '2026-05-31', // Hari Raya Waisak 2570 BE
  '2026-06-01', // Hari Lahir Pancasila
  '2026-06-16', // Tahun Baru Islam 1448 Hijriah
  '2026-08-17', // Hari Proklamasi Kemerdekaan Republik Indonesia
  '2026-08-25', // Maulid Nabi Muhammad SAW
  '2026-12-25', // Hari Raya Natal/Kelahiran Yesus Kristus
  
  // Cuti Bersama
  '2026-02-16', // Tahun Baru Imlek 2577 Kongzili (Cuti Bersama)
  '2026-03-18', // Hari Suci Nyepi Tahun Baru Saka 1948 (Cuti Bersama)
  '2026-03-20', // Hari Raya Idul Fitri 1447 Hijriyah (Cuti Bersama)
  '2026-03-23', // Hari Raya Idul Fitri 1447 Hijriyah (Cuti Bersama)
  '2026-03-24', // Hari Raya Idul Fitri 1447 Hijriyah (Cuti Bersama)
  '2026-05-15', // Kenaikan Yesus Kristus (Cuti Bersama)
  '2026-05-28', // Hari Raya Idul Adha 1447 Hijriyah (Cuti Bersama)
  '2026-12-24', // Hari Raya Natal (Cuti Bersama)
];

/**
 * Check if a date is a holiday
 * @param {Date} date - The date to check
 * @returns {boolean} - True if the date is a holiday
 */
export const isHoliday = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  // Check 2026 holidays
  if (year === 2026) {
    return holidays2026.includes(dateString);
  }
  
  // For other years, you can add more holiday arrays
  return false;
};

/**
 * Get holiday name for a date
 * @param {Date} date - The date to check
 * @returns {string|null} - Holiday name or null
 */
export const getHolidayName = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  if (year === 2026) {
    const holidayNames = {
      '2026-01-01': 'Tahun Baru 2026 Masehi',
      '2026-01-16': 'Isra Mikraj Nabi Muhammad SAW',
      '2026-02-16': 'Tahun Baru Imlek 2577 Kongzili (Cuti Bersama)',
      '2026-02-17': 'Tahun Baru Imlek 2577 Kongzili',
      '2026-03-18': 'Hari Suci Nyepi Tahun Baru Saka 1948 (Cuti Bersama)',
      '2026-03-19': 'Hari Suci Nyepi Tahun Baru Saka 1948',
      '2026-03-20': 'Hari Raya Idul Fitri 1447 Hijriyah (Cuti Bersama)',
      '2026-03-21': 'Hari Raya Idul Fitri 1447 Hijriah',
      '2026-03-22': 'Hari Raya Idul Fitri 1447 Hijriah',
      '2026-03-23': 'Hari Raya Idul Fitri 1447 Hijriyah (Cuti Bersama)',
      '2026-03-24': 'Hari Raya Idul Fitri 1447 Hijriyah (Cuti Bersama)',
      '2026-04-03': 'Wafat Yesus Kristus',
      '2026-04-05': 'Kebangkitan Yesus Kristus (Paskah)',
      '2026-05-01': 'Hari Buruh Internasional',
      '2026-05-14': 'Kenaikan Yesus Kristus',
      '2026-05-15': 'Kenaikan Yesus Kristus (Cuti Bersama)',
      '2026-05-27': 'Hari Raya Idul Adha 1447 Hijriah',
      '2026-05-28': 'Hari Raya Idul Adha 1447 Hijriyah (Cuti Bersama)',
      '2026-05-31': 'Hari Raya Waisak 2570 BE',
      '2026-06-01': 'Hari Lahir Pancasila',
      '2026-06-16': 'Tahun Baru Islam 1448 Hijriah',
      '2026-08-17': 'Hari Proklamasi Kemerdekaan Republik Indonesia',
      '2026-08-25': 'Maulid Nabi Muhammad SAW',
      '2026-12-24': 'Hari Raya Natal (Cuti Bersama)',
      '2026-12-25': 'Hari Raya Natal/Kelahiran Yesus Kristus',
    };
    return holidayNames[dateString] || null;
  }
  
  return null;
};

