#!/bin/bash

set -e

echo "=== ci_pre_xcodebuild.sh started ==="
echo "Checking Pods are installed..."

if [ ! -f "$CI_WORKSPACE/ios/Pods/Manifest.lock" ]; then
    echo "Pods not found — running pod install..."
    if ! command -v pod &> /dev/null; then
        echo "Installing CocoaPods..."
        gem install cocoapods --no-document -q
    fi
    cd "$CI_WORKSPACE/ios"
    pod install
fi

echo "=== ci_pre_xcodebuild.sh completed ==="
