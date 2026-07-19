#!/bin/bash
set -e
echo "=== ci_pre_xcodebuild.sh started ==="
if [ ! -f "$CI_WORKSPACE/ios/Pods/Manifest.lock" ]; then
    echo "Pods not found — installing..."
    gem install cocoapods --no-document -q
    cd "$CI_WORKSPACE/ios"
    pod install
fi
echo "=== ci_pre_xcodebuild.sh completed ==="
