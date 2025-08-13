#!/bin/bash

# Update CloudFront Distribution with Custom Domain
# Run this after SSL certificate is validated

set -e

# Configuration
DOMAIN_NAME="aixiv.co"
REGION="us-east-1"
BUCKET_NAME="aixiv-frontend"

echo "🔧 Updating CloudFront distribution with custom domain..."

# Get the distribution ID by looking for distributions pointing to our S3 bucket
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?DomainName=='$BUCKET_NAME.s3-website-$REGION.amazonaws.com']].Id" --output text)

if [ -z "$DISTRIBUTION_ID" ] || [ "$DISTRIBUTION_ID" = "None" ]; then
    echo "❌ No CloudFront distribution found for S3 bucket $BUCKET_NAME"
    echo "Please run the main deployment script first: ./aws-deploy.sh"
    exit 1
fi

echo "✅ Found distribution: $DISTRIBUTION_ID"

# Get the current distribution configuration
echo "📥 Getting current distribution configuration..."
aws cloudfront get-distribution-config --id $DISTRIBUTION_ID > dist-config.json

# Get the ETag
ETAG=$(cat dist-config.json | jq -r '.ETag')

# Check if certificate is validated
echo "🔍 Checking SSL certificate status..."
CERT_ARN=$(aws acm list-certificates --region $REGION --query "CertificateSummaryList[?DomainName=='$DOMAIN_NAME'].CertificateArn" --output text)

if [ -z "$CERT_ARN" ] || [ "$CERT_ARN" = "None" ]; then
    echo "❌ No SSL certificate found for $DOMAIN_NAME"
    echo "Please create a certificate in ACM first"
    exit 1
fi

CERT_STATUS=$(aws acm describe-certificate --certificate-arn $CERT_ARN --region $REGION --query 'Certificate.Status' --output text)

if [ "$CERT_STATUS" != "ISSUED" ]; then
    echo "❌ SSL certificate is not validated yet. Current status: $CERT_STATUS"
    echo "Please wait for certificate validation to complete"
    exit 1
fi

echo "✅ SSL certificate is validated: $CERT_ARN"

# Update the configuration to include the domain
echo "📝 Updating distribution configuration..."
jq '.DistributionConfig.Aliases.Items = ["'$DOMAIN_NAME'"] | .DistributionConfig.Aliases.Quantity = 1' dist-config.json > dist-config-updated.json

# Update the distribution
echo "🔄 Updating CloudFront distribution..."
aws cloudfront update-distribution \
    --id $DISTRIBUTION_ID \
    --distribution-config file://dist-config-updated.json \
    --if-match $ETAG

# Clean up
rm dist-config.json dist-config-updated.json

echo "✅ Distribution updated successfully!"
echo "🌐 Your site will be available at: https://$DOMAIN_NAME"
echo "⏳ Changes may take 10-15 minutes to propagate" 