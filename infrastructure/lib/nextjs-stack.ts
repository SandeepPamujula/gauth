import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as path from "path";
import * as fs from "fs";

export class NextjsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket for static assets
    const bucket = new s3.Bucket(this, "SPNextjsBucketgauth", {
      bucketName: `nextjs-${this.account}-${this.region}-${Date.now()}`,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create OAI (Origin Access Identity) for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OAI",
      {
        comment: "OAI for Next.js bucket",
      }
    );

    // Grant CloudFront access to the bucket
    bucket.grantRead(originAccessIdentity);

    // Create CloudFront distribution first
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: cdk.Duration.seconds(300),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
          ttl: cdk.Duration.seconds(300),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      comment: "Next.js CloudFront Distribution",
    });

    // Build output directories
    const projectRoot = path.join(__dirname, "../..");
    const staticOutputPath = path.join(projectRoot, "out");
    const buildOutputPath = path.join(projectRoot, ".next");
    const publicPath = path.join(projectRoot, "public");

    // Check if out directory exists (static export)
    const hasStaticExport = fs.existsSync(staticOutputPath);

    // Deploy static files to S3
    if (hasStaticExport) {
      // Deploy static export
      new s3deploy.BucketDeployment(this, "DeployStaticAssets", {
        sources: [s3deploy.Source.asset(staticOutputPath)],
        destinationBucket: bucket,
        distribution: distribution,
        distributionPaths: ["/*"],
        memoryLimit: 1024,
      });
    } else {
      // Deploy public folder if it exists
      const sources: s3deploy.ISource[] = [];
      
      if (fs.existsSync(publicPath)) {
        sources.push(s3deploy.Source.asset(publicPath));
      }

      // Deploy .next/static files if standalone build exists
      const staticDir = path.join(buildOutputPath, "static");
      if (fs.existsSync(staticDir)) {
        sources.push(
          s3deploy.Source.asset(staticDir, {
            exclude: ["**", "!**/*"],
          })
        );
      }

      if (sources.length > 0) {
        new s3deploy.BucketDeployment(this, "DeployStaticAssets", {
          sources: sources,
          destinationBucket: bucket,
          distribution: distribution,
          distributionPaths: ["/*"],
          memoryLimit: 1024,
        });
      } else {
        // Create a placeholder index.html if no static files found
        new s3deploy.BucketDeployment(this, "DeployStaticAssets", {
          sources: [
            s3deploy.Source.data(
              "index.html",
              '<!DOCTYPE html><html><head><title>Next.js App</title></head><body><h1>Please build the application first</h1></body></html>'
            ),
          ],
          destinationBucket: bucket,
          distribution: distribution,
          distributionPaths: ["/*"],
          memoryLimit: 1024,
        });
      }
    }

    // Output the CloudFront distribution URL
    new cdk.CfnOutput(this, "DistributionUrl", {
      value: `https://${distribution.distributionDomainName}`,
      description: "CloudFront Distribution URL",
      exportName: "DistributionUrl",
    });

    // Output the S3 bucket name
    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
      description: "S3 Bucket Name",
      exportName: "BucketName",
    });

    // Output the CloudFront distribution ID
    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
      description: "CloudFront Distribution ID",
      exportName: "DistributionId",
    });
  }
}

