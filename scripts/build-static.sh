#!/bin/bash

# Build script for static Next.js export
# This script builds the Next.js app as a static site for S3 deployment

set -e

echo "Building Next.js application for static export..."

# Clean up any leftover backup directories from previous builds
if [ -d "app/api.backup" ]; then
  echo "Cleaning up leftover app/api.backup directory..."
  rm -rf app/api.backup
fi

if [ -d ".api-backup" ]; then
  echo "Cleaning up leftover .api-backup directory..."
  # Check if app/api exists - if not, restore from backup
  if [ ! -d "app/api" ]; then
    echo "Restoring app/api from previous backup..."
    mv .api-backup app/api
  else
    echo "Removing stale .api-backup directory..."
    rm -rf .api-backup
  fi
fi

# Temporarily move API route directory (API routes can't be statically exported)
# Move it outside app/ directory so Next.js doesn't scan it
API_ROUTE_DIR="app/api"
API_ROUTE_BACKUP=".api-backup"

if [ -d "$API_ROUTE_DIR" ]; then
  echo "Temporarily moving API routes outside app directory..."
  mv "$API_ROUTE_DIR" "$API_ROUTE_BACKUP"
fi

# Update next.config.js temporarily for static export
cat > next.config.static.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  trailingSlash: true,
};

module.exports = nextConfig;
EOF

# Backup original config
cp next.config.js next.config.original.js

# Use static config
cp next.config.static.js next.config.js

# Build the application
echo "Building static export..."
npm run build

# Restore original config
cp next.config.original.js next.config.js
rm next.config.static.js next.config.original.js

# Restore API route directory
if [ -d "$API_ROUTE_BACKUP" ]; then
  echo "Restoring API routes..."
  mv "$API_ROUTE_BACKUP" "$API_ROUTE_DIR"
fi

echo "Build complete! Static files are in the 'out' directory."

