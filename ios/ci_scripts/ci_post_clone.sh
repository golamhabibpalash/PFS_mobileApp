#!/bin/bash
set -e
echo "=== ci_post_clone.sh started ==="

REPO_PATH="$CI_PRIMARY_REPOSITORY_PATH"

# Install Node.js via nvm (Xcode Cloud doesn't have it pre-installed)
export NVM_DIR="$HOME/.nvm"
if ! command -v nvm &> /dev/null && [ -s "$NVM_DIR/nvm.sh" ]; then
    \. "$NVM_DIR/nvm.sh"
fi
if ! command -v node &> /dev/null; then
    echo "Installing Node.js via nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
fi

# Install npm dependencies first (required for Podfile to load react_native_pods)
echo "Installing npm dependencies..."
cd "$REPO_PATH"
npm ci --prefer-offline || npm install

if ! command -v pod &> /dev/null; then
    echo "Installing CocoaPods..."
    gem install cocoapods --user-install --no-document
    export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
fi

echo "Running pod install..."
cd "$REPO_PATH/ios"
pod install
echo "=== ci_post_clone.sh completed ==="
