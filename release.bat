@echo off
echo *** Building React Native Android Release...
echo.

:: Run react-native-version with --never-amend option
call npm i

:: Run react-native-version with --never-amend option
echo.
echo *** Run react-native-version with --never-amend option...
call react-native-version --never-amend

:: Releasing Live Version ensuring app.json url to pfs.banglalink.net/
setlocal

set INITIAL_DIR=%cd%

where jq >nul 2>nul
if %errorlevel% neq 0 (
    echo jq is not installed or not in the PATH
    exit /b 1
)

set JSON_FILE=app.json
set LIVE_API_URL=https://pfs.banglalink.net/
set UAT_API_URL=https://pfsuat.banglalink.net/

:: Check if the JSON file exists
if not exist %JSON_FILE% (
    echo JSON file %JSON_FILE% not found
    exit /b 1
)

:: Update the apiBaseURL in the JSON file
jq ".apiBaseURL = \"%LIVE_API_URL%\"" %JSON_FILE% > temp.json && move /Y temp.json %JSON_FILE%
echo app.json file LIVE URL updated successfully

:: Bundle assets for Android
echo.
echo *** Bundle assets for Android...
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

:: Change directory to the Android folder
echo.
echo *** Change directory to the Android folder...
cd android

:: Run gradlew to assemble release
echo.
echo *** Run gradlew to assemble release for apk...
call gradlew assembleRelease

:: Run gradlew to bundle release
echo.
echo *** Run gradlew to bundle release for aab...
call gradlew bundleRelease

cd ..
:: Extract the version from package.json file
for /f %%i in ('jq -r .version package.json') do set version=%%i
echo *** Release version: %version%
echo.

:: Navigate to the directory where your app-release.apk file is located
cd android\app\build\outputs\apk\release

:: Copy and rename the app-release.apk file to pfs_{version}
copy app-release.apk pfs_live_%version%.apk
echo *** Copied Done ...
echo.

:: Move the renamed file to the \apk folder
move pfs_live_%version%.apk \
echo *** Moved Done ...
echo.


:: Copy aab file
echo copy and move aab file
cd %INITIAL_DIR%
cd android\app\build\outputs\bundle\release
copy app-release.aab pfs_live_%version%.aab
move pfs_live_%version%.aab \

:: below is under development
echo Releasing apk for UAT version
cd %INITIAL_DIR%
jq ".apiBaseURL = \"%UAT_API_URL%\"" %JSON_FILE% > temp.json && move /Y temp.json %JSON_FILE%
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
cd android
call gradlew assembleRelease
cd app\build\outputs\apk\release
copy app-release.apk pfs_uat_%version%.apk
move pfs_uat_%version%.apk \

:: revert app.json changes to live url
cd %INITIAL_DIR%
jq ".apiBaseURL = \"%LIVE_API_URL%\"" %JSON_FILE% > temp.json && move /Y temp.json %JSON_FILE%
endlocal

echo.
echo *** React Native Android Release build completed.

@echo off
echo Press any key to exit...
pause >nul

