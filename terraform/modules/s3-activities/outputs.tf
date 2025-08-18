output "bucket_name" {
  description = "Name of the S3 activities bucket"
  value       = aws_s3_bucket.activities.bucket
}

output "bucket_arn" {
  description = "ARN of the S3 activities bucket"
  value       = aws_s3_bucket.activities.arn
}

output "bucket_domain_name" {
  description = "Domain name of the S3 activities bucket"
  value       = aws_s3_bucket.activities.bucket_domain_name
}

output "bucket_regional_domain_name" {
  description = "Regional domain name of the S3 activities bucket"
  value       = aws_s3_bucket.activities.bucket_regional_domain_name
}