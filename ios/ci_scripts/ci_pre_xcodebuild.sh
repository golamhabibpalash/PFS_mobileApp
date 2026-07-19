#!/bin/bash
set -e
echo "=== ci_pre_xcodebuild.sh started ==="
echo "CI_WORKSPACE=$CI_WORKSPACE"
if [ ! -f "$CI_WORKSPACE/ios/Pods/Manifest.lock" ]; then
    echo "Pods not found — installing..."
    gem install cocoapods --no-document -q
    pod_workspace="${CI_WORKSPACE:-$PWD}"
    cd "$pod_workspace/ios"
    pod install
fi
echo "=== ci_pre_xcodebuild.sh completed ==="
