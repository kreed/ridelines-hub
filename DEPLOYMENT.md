# Deployment Guide

This guide explains how to deploy the Ridelines website to AWS using OpenTofu and GitHub Actions.

## Prerequisites

- AWS account with appropriate permissions
- GitHub repository with Actions enabled
- Domain name configured in Route 53 (or external DNS pointing to CloudFront)

## Initial Setup

### 1. Configure Backend State Management (Optional but Recommended)

Create an S3 bucket and DynamoDB table for Terraform state:

```bash
# Create state bucket (replace with your bucket name)
aws s3 mb s3://your-terraform-state-bucket --region us-west-2

# Create DynamoDB table for locking
aws dynamodb create-table \
  --table-name your-terraform-locks-table \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-west-2
```

Copy and configure backend:
```bash
cp terraform/backend.hcl.example terraform/backend.hcl
# Edit backend.hcl with your bucket and table names
```

### 2. Deploy Infrastructure

```bash
cd terraform

# Initialize (with backend config if using remote state)
tofu init -backend-config=backend.hcl

# Plan and apply
tofu plan -var="domain_name=ridelines.xyz"
tofu apply
```

### 3. Configure GitHub Repository

#### Secrets (sensitive values):
- `AWS_ROLE_ARN`: Get from `tofu output github_actions_role_arn`
- `PUBLIC_MAPBOX_ACCESS_TOKEN`: Your Mapbox access token

#### Variables (non-sensitive values):
- `DOMAIN_NAME`: ridelines.xyz
- `GITHUB_ORG`: kreed  
- `GITHUB_REPO`: ridelines-website
- `S3_BUCKET_NAME`: Get from `tofu output s3_bucket_name`
- `CLOUDFRONT_DISTRIBUTION_ID`: Get from `tofu output cloudfront_distribution_id`
- `PUBLIC_API_BASE_URL`: https://api.ridelines.xyz

### 4. Enable GitHub Actions

Create a production environment in your repository settings and configure the above secrets/variables.

## Deployment Workflows

### Infrastructure Changes
- Push changes to `terraform/` directory
- GitHub Actions will run `tofu plan` on PRs
- Merge to main will apply infrastructure changes

### Application Deployment  
- Push changes to application code
- GitHub Actions will build and deploy to S3/CloudFront
- CloudFront cache is automatically invalidated

### PR Previews
- Pull requests automatically deploy preview versions
- Preview URLs: `https://ridelines.xyz/pr-{number}/`
- Previews are cleaned up when PRs are closed

## Manual Deployment

If needed, you can deploy manually:

```bash
# Build application
npm run build

# Deploy to S3
aws s3 sync build/ s3://your-bucket-name/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id EXXXXX --paths "/*"
```

## Monitoring

- CloudWatch logs for Lambda functions
- CloudFront access logs (if enabled)
- GitHub Actions workflow logs
- AWS CloudTrail for infrastructure changes

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure GitHub Actions role has required S3 and CloudFront permissions
2. **Domain Issues**: Verify DNS settings and SSL certificate validation
3. **Build Failures**: Check environment variables and dependencies
4. **State Lock**: If state is locked, check DynamoDB table or use `tofu force-unlock`

### Useful Commands

```bash
# Check infrastructure status
tofu refresh && tofu plan

# View outputs
tofu output

# Force unlock state (use carefully)
tofu force-unlock LOCK_ID

# Manual cache invalidation
aws cloudfront create-invalidation --distribution-id EXXXXX --paths "/*"
```