output "website_url" {
  description = "URL of the website"
  value       = "https://${var.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront Distribution Domain Name"
  value       = module.cloudfront.distribution_domain_name
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = module.s3_website.bucket_name
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = module.s3_website.bucket_arn
}

output "activities_bucket_name" {
  description = "Name of the S3 activities bucket"
  value       = module.s3_activities.bucket_name
}

output "activities_bucket_arn" {
  description = "ARN of the S3 activities bucket"
  value       = module.s3_activities.bucket_arn
}

output "hosted_zone_id" {
  description = "Route 53 Hosted Zone ID"
  value       = module.dns.hosted_zone_id
}

output "certificate_arn" {
  description = "SSL Certificate ARN"
  value       = module.dns.certificate_arn
}

output "github_actions_role_arn" {
  description = "IAM Role ARN for GitHub Actions"
  value       = module.iam.github_actions_role_arn
}

output "deployment_instructions" {
  description = "Instructions for setting up GitHub Actions"
  value       = <<EOT
To set up GitHub Actions deployment:

1. Add these secrets to your GitHub repository:
   - AWS_ROLE_ARN: ${module.iam.github_actions_role_arn}
   - AWS_REGION: ${var.aws_region}
   - S3_BUCKET_NAME: ${module.s3_website.bucket_name}
   - CLOUDFRONT_DISTRIBUTION_ID: ${module.cloudfront.distribution_id}

2. Configure your domain DNS:
   - Set nameservers to: ${join(", ", module.dns.name_servers)}

3. Website will be available at: https://${var.domain_name}
EOT
}