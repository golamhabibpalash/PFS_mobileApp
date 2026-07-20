#!/bin/bash
set -e
echo "=== ci_pre_xcodebuild.sh started ==="

REPO_PATH="$CI_PRIMARY_REPOSITORY_PATH"

# Ensure Node.js is available (Xcode Cloud doesn't have it pre-installed)
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

# Export NODE_BINARY for Xcode build phases (React-rncore codegen, bundle, etc.)
export NODE_BINARY=$(command -v node)
echo "NODE_BINARY set to: $NODE_BINARY"

if [ ! -f "$REPO_PATH/ios/Pods/Manifest.lock" ]; then
    echo "Pods not found — installing..."
    # Ensure npm deps are installed (required for Podfile to load react_native_pods)
    if [ ! -d "$REPO_PATH/node_modules" ]; then
        cd "$REPO_PATH"
        npm ci --prefer-offline || npm install
    fi
    if ! command -v pod &> /dev/null; then
        gem install cocoapods --user-install --no-document
        export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
    fi
    cd "$REPO_PATH/ios"
    pod install
fi
echo "=== ci_pre_xcodebuild.sh completed ==="
