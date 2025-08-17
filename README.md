# Ridelines Hub

A SvelteKit web application for visualizing GPS activity data on interactive maps using PMTiles. This application displays running, cycling, hiking, and other GPS activities from athletes using efficient vector tile technology.

## Features

- **Interactive Activity Map**: View GPS tracks from various activities (rides, runs, walks, hikes, alpine skiing)
- **Vector Tile Performance**: Uses PMTiles format for fast, efficient map rendering
- **Activity Filtering**: Filter activities by type with real-time map updates
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop
- **Modern Tech Stack**: SvelteKit 2.0, TypeScript, Mapbox GL JS

## Architecture

### Frontend (SvelteKit)
- **Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS v4
- **Mapping**: Mapbox GL JS with PMTiles support
- **Build**: Vite with static adapter for deployment

### Infrastructure (AWS)
- **Hosting**: S3 static website with CloudFront CDN
- **DNS**: Route 53 with SSL certificates
- **Deployment**: GitHub Actions with OIDC authentication
- **Infrastructure as Code**: OpenTofu/Terraform

## Development

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run check` - Run TypeScript and Svelte checks
- `npm run lint` - Lint code with ESLint and Prettier
- `npm run format` - Format code with Prettier
- `npm run test:unit` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright

## Deployment

The application is automatically deployed to AWS when changes are pushed to the main branch.

### Infrastructure

Infrastructure is managed with OpenTofu (Terraform) and includes:

- **S3 Bucket**: Static website hosting
- **CloudFront**: Global CDN with custom domain
- **Route 53**: DNS management and SSL certificates
- **IAM**: GitHub Actions deployment permissions

### Configuration

Key infrastructure variables (see `terraform/variables.tf`):

- `domain_name` - Website domain (default: ridelines.xyz)
- `environment` - Deployment environment (default: production)
- `aws_region` - AWS region (default: us-west-2)
- `enable_logging` - CloudFront access logging (default: true)
- `price_class` - CloudFront pricing tier (default: PriceClass_100)

### Manual Deployment

To deploy infrastructure manually:

```bash
cd terraform
tofu init
tofu plan
tofu apply
```

## Data Format

The application expects PMTiles files containing GPS activity data with these properties:

- `id` - Unique activity identifier
- `name` - Activity name/title
- `activity_type` - Type (Ride, Run, Walk, Hike, AlpineSki, Other)
- `start_date_local` - Activity start date
- `distance` - Distance in meters
- `elapsed_time` - Duration in seconds

## Project Structure

```
├── src/
│   ├── lib/
│   │   ├── components/          # Svelte components
│   │   │   ├── ActivityMap.svelte
│   │   │   ├── FilterPanel.svelte
│   │   │   └── ErrorMessage.svelte
│   │   ├── stores/              # Svelte stores
│   │   ├── types/               # TypeScript definitions
│   │   └── types.ts
│   ├── routes/                  # SvelteKit routes
│   └── app.html                 # HTML template
├── terraform/                   # Infrastructure as code
│   ├── modules/                 # Reusable Terraform modules
│   │   ├── cloudfront/         # CloudFront distribution
│   │   ├── dns/                # Route 53 and certificates
│   │   ├── iam/                # GitHub Actions permissions
│   │   └── s3-website/         # S3 static hosting
│   └── main.tf                 # Main infrastructure config
├── .github/workflows/          # CI/CD pipelines
└── static/                     # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run test`
5. Check code quality: `npm run lint && npm run check`
6. Commit changes: `git commit -m "Description"`
7. Push to branch: `git push origin feature-name`
8. Open a Pull Request

## License

This project is part of the Ridelines ecosystem for visualizing GPS activity data.