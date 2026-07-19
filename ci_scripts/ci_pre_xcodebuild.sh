#!/bin/bash
set -e
echo "=== ci_pre_xcodebuild.sh started ==="

REPO_PATH="$CI_PRIMARY_REPOSITORY_PATH"

if [ ! -f "$REPO_PATH/ios/Pods/Manifest.lock" ]; then
    echo "Pods not found — installing..."
    if ! command -v pod &> /dev/null; then
        gem install cocoapods --user-install --no-document
        export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
    fi
    cd "$REPO_PATH/ios"
    pod install
fi
echo "=== ci_pre_xcodebuild.sh completed ==="
