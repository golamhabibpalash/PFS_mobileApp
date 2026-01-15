#!/bin/bash

echo "=============================="
echo "*** Building React Native Android Release on macOS ***"
echo "=============================="
echo

# Stop on error
set -e

# ----- CONFIG -----
JSON_FILE="app.json"
LIVE_API_URL="https://pfs.banglalink.net/"
UAT_API_URL="https://pfsuat.banglalink.net/"
ANDROID_DIR="android"
ASSETS_DIR="$ANDROID_DIR/app/src/main/assets"
RES_DIR="$ANDROID_DIR/app/src/main/res"
APK_OUTPUT_DIR="$ANDROID_DIR/app/build/outputs/apk/release"
AAB_OUTPUT_DIR="$ANDROID_DIR/app/build/outputs/bundle/release"
# ------------------

INITIAL_DIR=$(pwd)

# Ensure jq installed
if ! command -v jq &> /dev/null
then
    echo "ERROR: jq is not installed. Install: brew install jq"
    exit 1
fi

# ----- NPM INSTALL -----
echo "Running npm install..."
npm install
echo

# ----- VERSION UPDATE -----
echo "*** Applying react-native-version..."
npx react-native-version --never-amend
echo

# Extract version
VERSION=$(jq -r '.version' package.json)
echo "*** Version: $VERSION"
echo

# ----- UPDATE app.json to LIVE -----
echo "*** Updating app.json to LIVE URL..."
jq ".apiBaseURL = \"$LIVE_API_URL\"" "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"
echo "app.json updated (LIVE)"
echo

# ----- Bundle assets -----
echo "*** Bundling assets..."
mkdir -p "$ASSETS_DIR"
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output "$ASSETS_DIR/index.android.bundle" \
  --assets-dest "$RES_DIR"
echo

# ----- Gradle build APK -----
echo "*** Building APK (Release)..."
cd "$ANDROID_DIR"
./gradlew assembleRelease
echo

# ----- Gradle build AAB -----
echo "*** Building AAB (Release)..."
./gradlew bundleRelease
cd "$INITIAL_DIR"
echo

# ----- Copy and rename outputs -----
echo "*** Copying & renaming release outputs..."
mkdir -p ./apk
mkdir -p ./aab

cp "$APK_OUTPUT_DIR/app-release.apk" "./apk/pfs_live_${VERSION}.apk"
cp "$AAB_OUTPUT_DIR/app-release.aab" "./aab/pfs_live_${VERSION}.aab"

echo "Live APK → apk/pfs_live_${VERSION}.apk"
echo "Live AAB → aab/pfs_live_${VERSION}.aab"
echo

# ----- Build UAT Version -----
echo "*** Building UAT Release..."
jq ".apiBaseURL = \"$UAT_API_URL\"" "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"
echo "app.json updated (UAT)"
echo

# Re-bundle assets for UAT
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output "$ASSETS_DIR/index.android.bundle" \
  --assets-dest "$RES_DIR"
echo

# Build APK for UAT
cd "$ANDROID_DIR"
./gradlew assembleRelease
cd "$INITIAL_DIR"

cp "$APK_OUTPUT_DIR/app-release.apk" "./apk/pfs_uat_${VERSION}.apk"
echo "UAT APK → apk/pfs_uat_${VERSION}.apk"
echo

# ----- Restore LIVE settings -----
echo "*** Restoring LIVE settings..."
jq ".apiBaseURL = \"$LIVE_API_URL\"" "$JSON_FILE" > temp.json && mv temp.json "$JSON_FILE"
echo "app.json restored to LIVE"
echo

echo "=============================="
echo "*** Build completed successfully ***"
echo "=============================="
