#!/bin/bash

# AWS Frontend Deployment Script for aiXiv
# This script deploys the React app to S3 and sets up CloudFront

set -e

# Configuration
BUCKET_NAME="aixiv-frontend"
DOMAIN_NAME="aixiv.co"
REGION="us-east-1"
CLOUDFRONT_DISTRIBUTION_NAME="aiXiv Frontend Distribution"

echo "🚀 Starting AWS deployment for aiXiv frontend..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"

# Build the React app
echo "📦 Building React app..."
npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "✅ Build completed"

# Create S3 bucket if it doesn't exist
echo "🪣 Creating S3 bucket..."
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    aws s3 mb "s3://$BUCKET_NAME" --region $REGION
    echo "✅ S3 bucket created: $BUCKET_NAME"
else
    echo "✅ S3 bucket already exists: $BUCKET_NAME"
fi

# Disable Block Public Access settings
echo "🔓 Disabling Block Public Access settings..."
aws s3api put-public-access-block --bucket $BUCKET_NAME --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Configure S3 bucket for static website hosting
echo "🌐 Configuring S3 bucket for static website hosting..."
aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html

# Create bucket policy for public read access
echo "📜 Creating bucket policy..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

echo "✅ Bucket policy applied"

# Upload files to S3
echo "📤 Uploading files to S3..."
aws s3 sync build/ "s3://$BUCKET_NAME" --delete --cache-control "max-age=31536000,public"

echo "✅ Files uploaded to S3"

# Create CloudFront distribution
echo "☁️ Creating CloudFront distribution..."

# Check if CloudFront distribution already exists
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[?contains(@, '$DOMAIN_NAME')]].Id" --output text)

if [ -z "$DISTRIBUTION_ID" ] || [ "$DISTRIBUTION_ID" = "None" ]; then
    echo "Creating new CloudFront distribution..."
    
    # Create SSL certificate in ACM
    echo "🔐 Creating SSL certificate for $DOMAIN_NAME..."
    CERT_ARN=$(aws acm request-certificate \
        --domain-name $DOMAIN_NAME \
        --validation-method DNS \
        --region us-east-1 \
        --query 'CertificateArn' \
        --output text)
    
    echo "✅ SSL certificate requested: $CERT_ARN"
    echo "⏳ Please wait for the certificate to be validated (check AWS Console)"
    echo "   You may need to add DNS validation records to your Route53 hosted zone"
    
    # For now, create CloudFront distribution without custom domain
    echo "Creating CloudFront distribution without custom domain for now..."
    
    # Create CloudFront distribution configuration without aliases
    cat > cloudfront-config.json << EOF
{
    "CallerReference": "$(date +%s)",
    "Comment": "$CLOUDFRONT_DISTRIBUTION_NAME",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "Compress": true
    },
    "Enabled": true,
    "Aliases": {
        "Quantity": 0,
        "Items": []
    }
}
EOF

    DISTRIBUTION_ID=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --query 'Distribution.Id' --output text)
    rm cloudfront-config.json
    echo "✅ CloudFront distribution created: $DISTRIBUTION_ID"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Go to AWS Certificate Manager (ACM) in us-east-1 region"
    echo "2. Find the certificate for $DOMAIN_NAME"
    echo "3. Add the DNS validation records to your Route53 hosted zone"
    echo "4. Wait for certificate validation (usually 5-10 minutes)"
    echo "5. Run this script again to update the distribution with your domain"
else
    echo "✅ CloudFront distribution already exists: $DISTRIBUTION_ID"
fi

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ CloudFront cache invalidated"

# Create Route53 record (if not exists)
echo "🌍 Setting up Route53 record..."
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='$DOMAIN_NAME.'].[Id]" --output text | sed 's/\/hostedzone\///')

if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "❌ Hosted zone not found for $DOMAIN_NAME"
    echo "Please create a hosted zone for $DOMAIN_NAME in Route53 first."
else
    echo "✅ Found hosted zone: $HOSTED_ZONE_ID"
    
    # Get CloudFront domain name
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)
    
    # Create Route53 record
    cat > route53-change.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$DOMAIN_NAME",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z2FDTNDATAQYW2",
                    "DNSName": "$CLOUDFRONT_DOMAIN",
                    "EvaluateTargetHealth": false
                }
            }
        }
    ]
}
EOF

    aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch file://route53-change.json
    rm route53-change.json
    echo "✅ Route53 record created/updated"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   S3 Bucket: $BUCKET_NAME"
echo "   CloudFront Distribution: $DISTRIBUTION_ID"
echo "   Domain: https://$DOMAIN_NAME"
echo ""
echo "⏳ CloudFront distribution may take 10-15 minutes to fully deploy."
echo "Your site will be available at: https://$DOMAIN_NAME"
echo ""
echo "🔧 To update the deployment in the future, just run this script again." 