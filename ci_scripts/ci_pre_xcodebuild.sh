#!/bin/bash

# Install CocoaPods via Bundler before Xcode Cloud build
cd "$CI_WORKSPACE"

if ! command -v bundle &> /dev/null; then
    gem install bundler --no-document
fi

bundle install
cd ios
bundle exec pod install
