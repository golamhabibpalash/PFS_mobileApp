#!/bin/bash

set -e

echo "=== ci_post_clone.sh started ==="
echo "CI_WORKSPACE: $CI_WORKSPACE"
echo "CI_PROJECT_FILE: $CI_PROJECT_FILE"
echo "CI_XCODEBUILD_ACTION: $CI_XCODEBUILD_ACTION"

# Install CocoaPods
if ! command -v pod &> /dev/null; then
    echo "Installing CocoaPods..."
    gem install cocoapods --no-document -q
fi

echo "Running pod install..."
cd "$CI_WORKSPACE/ios"
pod install
echo "=== ci_post_clone.sh completed ==="
