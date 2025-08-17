# Data source for GitHub's OIDC thumbprint
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

# Create OIDC provider if it doesn't exist
resource "aws_iam_openid_connect_provider" "github" {
  count = 0

  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com",
  ]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]

  tags = var.tags
}

# IAM role for GitHub Actions
resource "aws_iam_role" "github_actions" {
  name = "${var.environment}-${replace(var.domain_name, ".", "-")}-github-actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = try(
            data.aws_iam_openid_connect_provider.github.arn,
            aws_iam_openid_connect_provider.github[0].arn
          )
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              "repo:${var.github_org}/${var.github_repo}:*"
            ]
          }
        }
      }
    ]
  })

  tags = var.tags
}


# IAM policy for CloudFront invalidation
resource "aws_iam_policy" "cloudfront_invalidation" {
  name        = "${var.environment}-${replace(var.domain_name, ".", "-")}-cloudfront-invalidation"
  description = "Policy for GitHub Actions to invalidate CloudFront cache"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Resource = "arn:aws:cloudfront::*:distribution/${var.cloudfront_distribution_id}"
      }
    ]
  })

  tags = var.tags
}

# Attach policies to the GitHub Actions role
resource "aws_iam_role_policy_attachment" "admin_access" {
  role       = aws_iam_role.github_actions.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
