#!/bin/bash
# Production build wrapper - ensures files end up in the right place
npm run build
mkdir -p server/public
cp -r dist/public/* server/public/
echo "✓ Build complete and files copied to server/public"
