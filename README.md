# Team Scheduler Mobile App

A lightweight React Native mobile app for managing team schedules with calendar view.

## Features

- **Team Selection**: Choose between Tim A or Tim B when opening the app
- **Calendar View**: Visual calendar showing office days for the selected team
- **Schedule Logic**: 
  - Monday & Tuesday: Always Tim A
  - Wednesday: Alternates between Tim A (odd weeks) and Tim B (even weeks)
  - Thursday & Friday: Always Tim B
  - Weekend: No office days
- **Year-long Schedule**: Pattern repeats throughout the entire year

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)
- Expo Go app on your mobile device (for testing)

## Project Structure

```
mobile-app/
├── App.js                 # Main app entry point
├── src/
│   ├── screens/
│   │   ├── TeamSelectionScreen.js    # Team selection screen
│   │   └── CalendarScreen.js          # Calendar view screen
│   └── utils/
│       └── scheduleLogic.js            # Schedule calculation logic
├── package.json
└── README.md
```

## Schedule Pattern

The app follows this schedule pattern:
- **Tim A**: Monday, Tuesday, and Wednesday (odd weeks)
- **Tim B**: Wednesday (even weeks), Thursday, Friday

The pattern repeats every 2 weeks and continues throughout the year.

## Technologies Used

- React Native
- Expo
- react-native-calendars (for calendar component)
- AsyncStorage (for persisting team selection)

## License

MIT

