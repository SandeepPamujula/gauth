#!/bin/bash

# Build script for static Next.js export
# This script builds the Next.js app as a static site for S3 deployment

echo "Building Next.js application for static export..."

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
npm run build

# Restore original config
cp next.config.original.js next.config.js
rm next.config.static.js next.config.original.js

echo "Build complete! Static files are in the 'out' directory."

