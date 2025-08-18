variable "domain_name" {
  description = "The domain name for the website"
  type        = string
  default     = "ridelines.xyz"
}

variable "environment" {
  description = "Environment name (e.g., production, staging)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "ridelines"
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-west-2"
}

variable "github_org" {
  description = "GitHub organization/username"
  type        = string
  default     = "kreed"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "ridelines-hub"
}

variable "enable_logging" {
  description = "Enable CloudFront access logging"
  type        = bool
  default     = true
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
  validation {
    condition = contains([
      "PriceClass_All",
      "PriceClass_200",
      "PriceClass_100"
    ], var.price_class)
    error_message = "Price class must be PriceClass_All, PriceClass_200, or PriceClass_100."
  }
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "ridelines"
    Environment = "production"
    ManagedBy   = "opentofu"
  }
}
