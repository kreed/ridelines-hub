# Backend configuration for OpenTofu state management
# This will be configured via terraform init -backend-config

terraform {
  backend "s3" {
    bucket = "terraform-284419413007"
    key    = "ridelines-hub/terraform.tfstate"
    region = "us-west-2"
  }
}

# Data sources for existing backend resources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
