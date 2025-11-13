# AWS CDK Infrastructure

This directory contains the AWS CDK infrastructure code for deploying the Next.js application to S3 and CloudFront.

## Structure

```
infrastructure/
├── bin/
│   └── app.ts              # CDK app entry point
├── lib/
│   └── nextjs-stack.ts     # Main CDK stack definition
├── cdk.json                # CDK configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Infrastructure dependencies
```

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Node.js 18+
3. AWS CDK CLI installed globally or locally

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Bootstrap CDK (first time only):
   ```bash
   cdk bootstrap
   ```

## Deployment

### Build the Next.js Application

Before deploying, build your Next.js application:

```bash
# From project root
npm run build
```

### Deploy Infrastructure

```bash
# From infrastructure directory
cdk deploy
```

Or from project root:

```bash
npm run cdk:deploy
```

## CDK Commands

- `cdk synth` - Synthesize CloudFormation template
- `cdk diff` - Compare deployed stack with current state
- `cdk deploy` - Deploy the stack
- `cdk destroy` - Destroy the stack

## Stack Outputs

After deployment, the stack outputs:
- **DistributionUrl** - CloudFront distribution URL
- **BucketName** - S3 bucket name
- **DistributionId** - CloudFront distribution ID

## What Gets Deployed

1. **S3 Bucket** - Stores static assets
2. **CloudFront Distribution** - CDN for serving content
3. **Origin Access Identity (OAI)** - Secure access to S3 bucket
4. **Bucket Deployment** - Automatically uploads build artifacts

## Notes

- The stack uses a timestamp-based bucket name to ensure uniqueness
- The bucket is configured for automatic deletion on stack destruction
- CloudFront distribution uses HTTPS and caching optimized policy
- Static files are automatically invalidated in CloudFront cache on deployment

