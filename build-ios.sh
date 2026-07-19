#!/bin/bash

echo "*** Building React Native iOS Release..."
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
LIVE_API_URL=$(jq -r '.apiBaseURL' "$JSON_FILE")
UAT_API_URL=$(jq -r '.apiBaseURLDev' "$JSON_FILE")

# Check if the JSON file exists
if [ ! -f "$JSON_FILE" ]; then
    echo "JSON file $JSON_FILE not found"
    exit 1
fi

# Update the apiBaseURL in the JSON file for LIVE
jq ".apiBaseURL = \"$LIVE_API_URL\"" "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"
echo "app.json file LIVE URL updated successfully"

# Bundle assets for iOS
echo ""
echo "*** Bundle assets for iOS..."
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios/

# Install CocoaPods
echo ""
echo "*** Install CocoaPods..."
cd ios
pod install

# Archive the app
echo ""
echo "*** Archive the app with xcodebuild..."
xcodebuild -workspace BLPfs.xcworkspace -scheme BLPfs -configuration Release -archivePath ~/BLPfs.xcarchive archive

cd "$INITIAL_DIR"

# Extract the version from package.json file
version=$(jq -r .version package.json)
echo "*** Release version: $version"
echo ""

# Build LIVE IPA
echo ""
echo "*** Export LIVE IPA..."
mkdir -p ios/build
xcodebuild -exportArchive -archivePath ~/BLPfs.xcarchive -exportPath ios/build -exportOptionsPlist ios/exportOptions.plist 2>/dev/null || \
xcodebuild -exportArchive -archivePath ~/BLPfs.xcarchive -exportPath ios/build -exportOptionsPlist ios/exportOptions.plist -allowProvisioningUpdates

# Find and rename the IPA
IPA_FILE=$(ls ios/build/*.ipa 2>/dev/null | head -1)
if [ -n "$IPA_FILE" ]; then
    cp "$IPA_FILE" "pfs_live_${version}.ipa"
    mv "pfs_live_${version}.ipa" ~/
    echo "*** Copied and moved LIVE IPA to home directory ..."
fi

# Clean up archive
rm -rf ~/BLPfs.xcarchive

# Build UAT version
echo ""
echo "*** Releasing IPA for UAT version..."
cd "$INITIAL_DIR"
jq ".apiBaseURL = \"$UAT_API_URL\"" "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"
npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios/
cd ios
pod install
xcodebuild -workspace BLPfs.xcworkspace -scheme BLPfs -configuration Release -archivePath ~/BLPfs.xcarchive archive
xcodebuild -exportArchive -archivePath ~/BLPfs.xcarchive -exportPath ios/build -exportOptionsPlist ios/exportOptions.plist -allowProvisioningUpdates

cd "$INITIAL_DIR"

IPA_UAT_FILE=$(ls ios/build/*.ipa 2>/dev/null | head -1)
if [ -n "$IPA_UAT_FILE" ]; then
    cp "$IPA_UAT_FILE" "pfs_uat_${version}.ipa"
    mv "pfs_uat_${version}.ipa" ~/
    echo "*** Copied and moved UAT IPA to home directory ..."
fi

# Clean up archive
rm -rf ~/BLPfs.xcarchive

# Revert app.json changes to live url
cd "$INITIAL_DIR"
jq ".apiBaseURL = \"$LIVE_API_URL\"" "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"

echo ""
echo "*** React Native iOS Release build completed."
echo ""
echo "Files saved to your home directory (~/):"
echo "- pfs_live_${version}.ipa"
echo "- pfs_uat_${version}.ipa"
echo ""
echo "Press any key to exit..."
read -n 1
