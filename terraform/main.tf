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
  bucket_name = "${var.project_name}-${var.environment}-website"
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

  domain_name                = var.domain_name
  s3_bucket_name            = module.s3_website.bucket_name
  s3_bucket_domain_name     = module.s3_website.bucket_domain_name
  s3_bucket_arn             = module.s3_website.bucket_arn
  certificate_arn           = module.dns.certificate_arn
  hosted_zone_id            = module.dns.hosted_zone_id
  price_class               = var.price_class
  enable_logging            = var.enable_logging
  environment               = var.environment
  tags                      = local.common_tags

  depends_on = [
    module.s3_website,
    module.dns
  ]
}

# IAM Module for GitHub Actions
module "iam" {
  source = "./modules/iam"

  domain_name            = var.domain_name
  s3_bucket_name        = module.s3_website.bucket_name
  s3_bucket_arn         = module.s3_website.bucket_arn
  cloudfront_distribution_id = module.cloudfront.distribution_id
  github_org            = var.github_org
  github_repo           = var.github_repo
  environment           = var.environment
  tags                  = local.common_tags

  depends_on = [
    module.s3_website,
    module.cloudfront
  ]
}