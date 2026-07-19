#!/bin/bash
set -e
echo "=== ci_post_clone.sh started ==="

REPO_PATH="$CI_PRIMARY_REPOSITORY_PATH"

if ! command -v pod &> /dev/null; then
    echo "Installing CocoaPods..."
    gem install cocoapods --user-install --no-document
    export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
fi

echo "Running pod install..."
cd "$REPO_PATH/ios"
pod install
echo "=== ci_post_clone.sh completed ==="
