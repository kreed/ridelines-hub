# Update S3 bucket policy with CloudFront distribution ARN
# This runs after CloudFront distribution is created
resource "aws_s3_bucket_policy" "website_cloudfront" {
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