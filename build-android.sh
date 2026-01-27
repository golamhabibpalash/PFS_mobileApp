#!/bin/bash

echo "*** Building React Native Android Release..."
echo ""

# Run npm install
npm i

# Run react-native-version with --never-amend option
echo ""
echo "*** Run react-native-version with --never-amend option..."
react-native-version --never-amend

# Releasing Live Version ensuring app.json url to pfs.banglalink.net/
INITIAL_DIR=$(pwd)

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Please install it using: brew install jq"
    exit 1
fi

JSON_FILE="app.json"
LIVE_API_URL="https://pfs.banglalink.net/"
UAT_API_URL="https://pfsuat.banglalink.net/"

# Check if the JSON file exists
if [ ! -f "$JSON_FILE" ]; then
    echo "JSON file $JSON_FILE not found"
    exit 1
fi

# Update the apiBaseURL in the JSON file for LIVE
jq ".apiBaseURL = \"$LIVE_API_URL\"" "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"
echo "app.json file LIVE URL updated successfully"

# Bundle assets for Android
echo ""
echo "*** Bundle assets for Android..."
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

# Change directory to the Android folder
echo ""
echo "*** Change directory to the Android folder..."
cd android

# Run gradlew to assemble release
echo ""
echo "*** Run gradlew to assemble release for apk..."
./gradlew assembleRelease

# Run gradlew to bundle release
echo ""
echo "*** Run gradlew to bundle release for aab..."
./gradlew bundleRelease

cd ..

# Extract the version from package.json file
version=$(jq -r .version package.json)
echo "*** Release version: $version"
echo ""

# Navigate to the directory where your app-release.apk file is located
cd android/app/build/outputs/apk/release

# Copy and rename the app-release.apk file to pfs_{version}
cp app-release.apk "pfs_live_${version}.apk"
echo "*** Copied Done ..."
echo ""

# Move the renamed file to the home directory
mv "pfs_live_${version}.apk" ~/
echo "*** Moved to home directory ..."
echo ""

# Copy aab file
echo "copy and move aab file"
cd "$INITIAL_DIR"
cd android/app/build/outputs/bundle/release
cp app-release.aab "pfs_live_${version}.aab"
mv "pfs_live_${version}.aab" ~/

# Build UAT version
echo "Releasing apk for UAT version"
cd "$INITIAL_DIR"
jq ".apiBaseURL = \"$UAT_API_URL\"" "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
cd android
./gradlew assembleRelease
cd app/build/outputs/apk/release
cp app-release.apk "pfs_uat_${version}.apk"
mv "pfs_uat_${version}.apk" ~/

# Revert app.json changes to live url
cd "$INITIAL_DIR"
jq ".apiBaseURL = \"$LIVE_API_URL\"" "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"

echo ""
echo "*** React Native Android Release build completed."
echo ""
echo "Files saved to your home directory (~/):"
echo "- pfs_live_${version}.apk"
echo "- pfs_live_${version}.aab"
echo "- pfs_uat_${version}.apk"
echo ""
echo "Press any key to exit..."
read -n 1