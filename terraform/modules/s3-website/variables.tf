variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "domain_name" {
  description = "The domain name for the website"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}


variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}