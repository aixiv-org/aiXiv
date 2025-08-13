# AWS Deployment Guide for aiXiv Frontend

This guide will help you deploy your React frontend to AWS using S3 + CloudFront + Route53.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Domain registered** in Route53 (aixiv.co)
4. **Node.js** and npm installed

## Quick Deployment

### Option 1: Automated Script (Recommended)

1. **Make the script executable:**
   ```bash
   chmod +x aws-deploy.sh
   ```

2. **Run the deployment script:**
   ```bash
   ./aws-deploy.sh
   ```

The script will automatically:
- Build your React app
- Create S3 bucket
- Configure static website hosting
- Set up CloudFront distribution
- Configure Route53 DNS records
- Upload files and invalidate cache

### Option 2: Manual Steps

#### 1. Build the Application
```bash
npm run build
```

#### 2. Create S3 Bucket
```bash
aws s3 mb s3://aixiv-frontend --region us-east-1
```

#### 3. Configure S3 for Static Website Hosting
```bash
aws s3 website s3://aixiv-frontend --index-document index.html --error-document index.html
```

#### 4. Set Bucket Policy for Public Access
```bash
aws s3api put-bucket-policy --bucket aixiv-frontend --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::aixiv-frontend/*"
        }
    ]
}'
```

#### 5. Upload Files to S3
```bash
aws s3 sync build/ s3://aixiv-frontend --delete --cache-control "max-age=31536000,public"
```

#### 6. Create CloudFront Distribution
Use the AWS Console or AWS CLI to create a CloudFront distribution pointing to your S3 bucket.

#### 7. Configure Route53
Create an A record pointing your domain to the CloudFront distribution.

## GitHub Actions Deployment

For automated deployment on every push:

1. **Add AWS credentials to GitHub Secrets:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

2. **Push to main/master branch:**
   The GitHub Actions workflow will automatically deploy your changes.

## Environment Variables

Make sure to set the correct environment variables for production:

```bash
# In your .env file or deployment environment
REACT_APP_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
REACT_APP_API_URL=https://your-backend-domain.com
```

## SSL Certificate

CloudFront will automatically provision an SSL certificate for your domain through AWS Certificate Manager.

## Troubleshooting

### Common Issues

1. **403 Forbidden on S3:**
   - Check bucket policy allows public read access
   - Ensure bucket is configured for static website hosting

2. **CloudFront not updating:**
   - Create cache invalidation: `aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"`

3. **Domain not resolving:**
   - Check Route53 A record points to CloudFront distribution
   - Verify CloudFront distribution has your domain as an alias

4. **CORS issues:**
   - Ensure your backend CORS settings include your production domain

### Useful Commands

```bash
# Check S3 bucket contents
aws s3 ls s3://aixiv-frontend

# List CloudFront distributions
aws cloudfront list-distributions

# Get distribution details
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID

# Invalidate cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

# Check Route53 records
aws route53 list-resource-record-sets --hosted-zone-id YOUR_HOSTED_ZONE_ID
```

## Cost Optimization

- **S3**: Very low cost for static hosting
- **CloudFront**: Pay per request and data transfer
- **Route53**: ~$0.50/month per hosted zone
- **ACM**: Free SSL certificates

## Security Best Practices

1. **IAM Roles:** Use IAM roles instead of access keys when possible
2. **Bucket Policies:** Only allow necessary permissions
3. **CloudFront:** Enable security headers and HTTPS redirect
4. **Monitoring:** Set up CloudWatch alarms for costs and errors

## Next Steps

After deployment:
1. Test all functionality on the production domain
2. Set up monitoring and logging
3. Configure backup and disaster recovery
4. Set up CI/CD pipeline for automated deployments 