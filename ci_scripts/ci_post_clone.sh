#!/bin/bash
set -e
echo "=== ci_post_clone.sh started ==="
gem install cocoapods --no-document -q
cd "$CI_WORKSPACE/ios"
pod install
echo "=== ci_post_clone.sh completed ==="
