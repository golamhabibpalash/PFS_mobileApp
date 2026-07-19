#!/bin/bash

# Install CocoaPods before Xcode Cloud build
cd "$CI_WORKSPACE/ios"
pod install
