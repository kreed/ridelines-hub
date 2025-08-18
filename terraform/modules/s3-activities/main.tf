# S3 bucket for activities data (PMTiles)
resource "aws_s3_bucket" "activities" {
  bucket = var.bucket_name

  tags = var.tags
}

# S3 bucket versioning
resource "aws_s3_bucket_versioning" "activities" {
  bucket = aws_s3_bucket.activities.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 bucket server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "activities" {
  bucket = aws_s3_bucket.activities.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block all public access by default - CloudFront will access via OAC
resource "aws_s3_bucket_public_access_block" "activities" {
  bucket = aws_s3_bucket.activities.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 bucket CORS configuration for PMTiles access
resource "aws_s3_bucket_cors_configuration" "activities" {
  bucket = aws_s3_bucket.activities.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["https://${var.domain_name}"]
    expose_headers  = ["ETag", "Content-Type", "Content-Length"]
    max_age_seconds = 86400  # 24 hours for PMTiles
  }
}

# S3 bucket lifecycle configuration for activities
resource "aws_s3_bucket_lifecycle_configuration" "activities" {
  bucket = aws_s3_bucket.activities.id

  rule {
    id     = "manage_pmtiles"
    status = "Enabled"

    filter {
      prefix = "activities/"
    }

    # Keep current versions indefinitely but clean up old versions
    noncurrent_version_expiration {
      noncurrent_days = 7  # PMTiles are typically replaced, keep old versions briefly
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1  # Clean up failed uploads quickly
    }
  }
}