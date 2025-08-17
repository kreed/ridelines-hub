# Backend configuration for OpenTofu state management
# This will be configured via terraform init -backend-config

terraform {
  backend "s3" {
    # These values will be provided via backend configuration file or CLI
    # bucket         = "ridelines-terraform-state"
    # key            = "ridelines-hub/terraform.tfstate"
    # region         = "us-west-2"
    # dynamodb_table = "ridelines-terraform-locks"
    # encrypt        = true
  }
}

# Data sources for existing backend resources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
