# Fix Build Dependencies

The build is failing due to dependency version mismatches. Run these commands to fix:

```bash
# Fix all dependencies to match Expo SDK 54
npx expo install --fix

# This will automatically update all packages to compatible versions
```

After running `expo install --fix`, try building again:

```bash
eas build --platform android --profile preview
```

## Alternative: Manual Fix

If `expo install --fix` doesn't work, the issue is that React Native 0.81.5 is too new for Expo SDK 54. 
Expo SDK 54 requires React Native 0.76.5.

The package.json has been updated to use React Native 0.76.5, but you should run:

```bash
npm install
```

Then rebuild.

