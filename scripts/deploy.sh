#!/bin/bash

# Deployment script for AWS CDK
# This script builds and deploys the Next.js application to AWS

set -e

echo "Starting deployment process..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo "Error: AWS CDK is not installed. Installing..."
    npm install -g aws-cdk
fi

# Navigate to infrastructure directory
cd infrastructure

# Install infrastructure dependencies
echo "Installing infrastructure dependencies..."
npm install

# Build infrastructure code
echo "Building infrastructure code..."
npm run build

# Bootstrap CDK (only needed once per account/region)
echo "Bootstrapping CDK (if needed)..."
cdk bootstrap || echo "CDK already bootstrapped or bootstrap failed"

# Go back to root
cd ..

# Build Next.js application
echo "Building Next.js application..."
npm run build

# Deploy to AWS
echo "Deploying to AWS..."
cd infrastructure
cdk deploy --require-approval never

echo "Deployment complete!"
echo "Check the CloudFront URL in the CDK output above."

