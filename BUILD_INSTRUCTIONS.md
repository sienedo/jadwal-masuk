# Build APK Instructions for Jadwal Masuk

## Prerequisites
1. Node.js installed
2. Expo account (free) - sign up at https://expo.dev

## Steps to Build APK

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```
(If you don't have an account, create one at https://expo.dev)

### Step 3: Configure EAS (if needed)
```bash
eas build:configure
```

### Step 4: Build the APK
```bash
eas build --platform android --profile preview
```

Or use the npm script:
```bash
npm run build:android
```

### Step 5: Download the APK
- The build will take about 10-15 minutes
- You'll get a link to download the APK when it's ready
- The APK will be available in your Expo dashboard

## Alternative: Local Build (Advanced)

If you have Android SDK installed locally, you can also build locally:

```bash
npx expo run:android --variant release
```

This will generate an APK in: `android/app/build/outputs/apk/release/app-release.apk`

## Notes
- The APK will be named "Jadwal Masuk"
- Package name: `com.jadwalmasuk.app`
- The APK can be shared directly with friends
- They can install it by enabling "Install from Unknown Sources" in Android settings

