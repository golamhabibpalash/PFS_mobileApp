#!/bin/bash

set -e

echo "=== ci_post_clone.sh started ==="

# Install CocoaPods
gem install cocoapods --no-document

echo "Running pod install..."
cd "$CI_WORKSPACE/ios"
pod install
echo "=== ci_post_clone.sh completed ==="
