# Configure the AWS Provider
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

# AWS provider for us-east-1 (required for CloudFront certificates)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = var.tags
  }
}

# Locals for resource naming
locals {
  bucket_name            = "${var.project_name}-${var.environment}-website-assets"
  activities_bucket_name = "${var.project_name}-${var.environment}-activities"
  common_tags = merge(var.tags, {
    Domain = var.domain_name
  })
}

# S3 Website Module
module "s3_website" {
  source = "./modules/s3-website"

  bucket_name = local.bucket_name
  domain_name = var.domain_name
  environment = var.environment
  tags        = local.common_tags
}

# S3 Activities Module
module "s3_activities" {
  source = "./modules/s3-activities"

  bucket_name = local.activities_bucket_name
  domain_name = var.domain_name
  environment = var.environment
  tags        = local.common_tags
}

# DNS Module (Route 53 and SSL Certificate)
module "dns" {
  source = "./modules/dns"

  domain_name = var.domain_name
  environment = var.environment
  tags        = local.common_tags

  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}

# CloudFront Module
module "cloudfront" {
  source = "./modules/cloudfront"

  domain_name                   = var.domain_name
  s3_bucket_name                = module.s3_website.bucket_name
  s3_bucket_domain_name         = module.s3_website.bucket_regional_domain_name
  s3_bucket_arn                 = module.s3_website.bucket_arn
  activities_bucket_name        = module.s3_activities.bucket_name
  activities_bucket_domain_name = module.s3_activities.bucket_regional_domain_name
  activities_bucket_arn         = module.s3_activities.bucket_arn
  certificate_arn               = module.dns.certificate_arn
  hosted_zone_id                = module.dns.hosted_zone_id
  price_class                   = var.price_class
  enable_logging                = var.enable_logging
  environment                   = var.environment
  tags                          = local.common_tags

  depends_on = [
    module.s3_website,
    module.s3_activities,
    module.dns
  ]
}

# IAM Module for GitHub Actions
module "iam" {
  source = "./modules/iam"

  domain_name                = var.domain_name
  s3_bucket_name             = module.s3_website.bucket_name
  s3_bucket_arn              = module.s3_website.bucket_arn
  cloudfront_distribution_id = module.cloudfront.distribution_id
  github_org                 = var.github_org
  github_repo                = var.github_repo
  environment                = var.environment
  tags                       = local.common_tags

  depends_on = [
    module.s3_website,
    module.cloudfront
  ]
}

# S3 bucket policy for CloudFront access (created after both S3 and CloudFront exist)
resource "aws_s3_bucket_policy" "cloudfront_access" {
  bucket = module.s3_website.bucket_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${module.s3_website.bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [
    module.s3_website,
    module.cloudfront
  ]
}

# S3 bucket policy for activities CloudFront access
resource "aws_s3_bucket_policy" "activities_cloudfront_access" {
  bucket = module.s3_activities.bucket_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipalActivities"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${module.s3_activities.bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.distribution_arn
          }
        }
      }
    ]
  })

  depends_on = [
    module.s3_activities,
    module.cloudfront
  ]
}