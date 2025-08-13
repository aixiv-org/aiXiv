#!/bin/bash

# Check Domain Configuration for aiXiv
set -e

DOMAIN_NAME="aixiv.co"
REGION="us-east-1"
BUCKET_NAME="aixiv-frontend"

echo "🌐 Checking domain configuration for aiXiv..."

# Get CloudFront distribution ID
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?DomainName=='$BUCKET_NAME.s3-website-$REGION.amazonaws.com']].Id" --output text)

if [ -z "$DISTRIBUTION_ID" ] || [ "$DISTRIBUTION_ID" = "None" ]; then
    echo "❌ No CloudFront distribution found"
    exit 1
fi

echo "✅ Found CloudFront distribution: $DISTRIBUTION_ID"

# Get distribution details
echo "📋 Distribution details:"
aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.{DomainName:DomainName,Aliases:Aliases.Items,Status:Status}' --output table

# Check Route53 records
echo ""
echo "🌍 Checking Route53 records..."

HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='$DOMAIN_NAME.'].[Id]" --output text | sed 's/\/hostedzone\///')

if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "❌ Hosted zone not found for $DOMAIN_NAME"
    exit 1
fi

echo "✅ Found hosted zone: $HOSTED_ZONE_ID"

# List all records
echo "📝 Route53 records for $DOMAIN_NAME:"
aws route53 list-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --query 'ResourceRecordSets[?Type==`A`].{Name:Name,Type:Type,AliasTarget:AliasTarget.DNSName}' --output table

echo ""
echo "🔍 Summary:"
echo "- Main domain: https://$DOMAIN_NAME"
echo "- WWW subdomain: https://www.$DOMAIN_NAME"
echo "- Both should point to the same CloudFront distribution"
echo "- Updates to the distribution will affect both domains" 