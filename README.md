# Ridelines Hub

The interactive frontend for the Ridelines GPS activity visualization platform. A SvelteKit application that provides 3D terrain visualization of cycling, running, and hiking activities with OAuth authentication through intervals.icu.

## Overview

Ridelines Hub is a high-performance web application that transforms your GPS activities into stunning 3D visualizations. It connects to your intervals.icu account to display your rides, runs, hikes, and other activities on realistic terrain maps.

### Key Features

- **OAuth Authentication**: Secure login through intervals.icu integration
- **3D Terrain Visualization**: MapLibre GL JS with globe projection and realistic terrain
- **Activity Filtering**: Interactive controls for different activity types
- **PMTiles Integration**: Efficient vector tile delivery from personalized data
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Updates**: Declarative reactivity with Svelte 5 runes
- **Static Site**: Optimized for CloudFront CDN deployment

## Technology Stack

- **Framework**: SvelteKit 2.0 with TypeScript and static adapter
- **Authentication**: intervals.icu OAuth 2.0 with JWT cookies
- **Mapping**: MapLibre GL JS with PMTiles protocol and MapTiler terrain
- **State Management**: Svelte 5 runes for reactive state
- **API Client**: Auto-generated TypeScript client from OpenAPI specification
- **Code Quality**: Biome for linting and formatting
- **Testing**: Vitest (unit) and Playwright (E2E)
- **Build**: Vite with proxy configuration for development

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- intervals.icu account for authentication

### Development Setup

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd ridelines-hub
   npm install
   ```

2. **Environment configuration**:
   Create a `.env.local` file:
   ```env
   VITE_API_URL=https://api.dev.ridelines.xyz
   VITE_MAPTILER_API_KEY=your_maptiler_key
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` - the Vite proxy handles API calls

4. **Generate API types** (automatic):
   ```bash
   npm run generate-types
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with API proxy |
| `npm run build` | Build static site for production |
| `npm run preview` | Preview production build |
| `npm run check` | TypeScript and Svelte type checking |
| `npm run lint` | Code linting with Biome |
| `npm run format` | Code formatting with Biome |
| `npm run test:unit` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run generate-types` | Generate API types from OpenAPI spec |

## Architecture

### Authentication Flow

1. **Landing Page**: Unauthenticated users see login prompt
2. **OAuth Redirect**: Login redirects to intervals.icu OAuth
3. **Callback Handling**: API processes OAuth callback and sets JWT cookie
4. **Protected Routes**: `/map` route requires authentication
5. **API Requests**: All API calls include authentication cookie

### Component Structure

```
src/
├── lib/
│   ├── api/                    # Auto-generated API client and types
│   ├── components/
│   │   ├── ActivityMap.svelte     # Main 3D map with reactive data loading
│   │   ├── FilterPanel.svelte     # Activity type filtering
│   │   ├── ErrorMessage.svelte    # Error display component
│   │   └── icons/                 # Activity type SVG icons
│   ├── services/
│   │   └── ridelines.ts          # API service with authentication
│   ├── stores/
│   │   ├── auth.svelte.ts        # Authentication state (Svelte 5 runes)
│   │   └── config.ts             # Application configuration
│   ├── utils/
│   │   └── auth-guard.ts         # Route protection utilities
│   ├── config/
│   │   └── env.ts                # Environment configuration
│   └── types.ts                  # Application type definitions
├── routes/
│   ├── +layout.svelte            # Root layout with auth initialization
│   ├── +page.svelte              # Landing/login page
│   └── map/
│       └── +page.svelte          # Protected map page
└── app.html                      # HTML template
```

### State Management

- **Auth Store**: Svelte 5 runes-based authentication state
- **Reactive Loading**: ActivityMap waits for both auth and map style loading
- **Client-Side Guards**: Route protection without server-side rendering
- **API Integration**: Centralized service layer with error handling

### Development Features

- **Vite Proxy**: API requests to `/api/*` proxied to backend
- **OAuth Transform**: Redirect URLs transformed for localhost development
- **Cookie Handling**: Set-Cookie domain transformed for localhost
- **Hot Reload**: Instant updates during development

## Data Flow

1. **Page Load**: SvelteKit initializes with auth state check
2. **Authentication**: OAuth flow or existing JWT cookie validation
3. **User Data**: API call retrieves user profile and PMTiles URL
4. **Map Rendering**: Reactive statement triggers when auth and map ready
5. **Activity Loading**: PMTiles source added with signed CloudFront URLs

## Configuration

### Environment Variables

Production builds require:
- `VITE_MAPTILER_API_KEY`: MapTiler API key for terrain tiles
- `VITE_API_URL`: Backend API URL (optional, defaults to "/api" for proxy)

### Map Configuration

Configured in `src/lib/stores/config.ts`:
- MapTiler terrain and styles
- Activity type colors and icons
- Default map center and zoom
- Responsive behavior

## API Integration

### Auto-Generated Client

The API client is generated from the backend's OpenAPI specification:

```typescript
// Generated types and client
import { getUserProfile } from '$lib/api';
import type { UserProfileResponse } from '$lib/api/types.gen';

// Service layer wrapper
const userData = await ridelinesService.getUser();
```

### Authentication Service

```typescript
// Check authentication status
await authStore.init();

// Access user data
const { user, pmtilesUrl } = authStore;

// Login flow
authStore.login('/map');
```

## Deployment

### Build Process

1. **Type Generation**: OpenAPI types generated during `npm install`
2. **Static Build**: SvelteKit builds pre-rendered static site
3. **Container Packaging**: GitHub Actions packages for deployment
4. **CDN Deployment**: Frame infrastructure deploys to S3/CloudFront

### GitHub Actions Workflow

- **Test**: Linting, type checking, and test execution (parallel)
- **Build**: Static site generation with environment variables (parallel)
- **Publish**: Docker container creation and deployment trigger

### Environment Secrets

Required GitHub secrets:
- `MAPTILER_API_KEY`: MapTiler API key for terrain data
- `FRAME_REPO_TOKEN`: Token for triggering infrastructure deployments

## Performance

### Optimization Features

- **Static Generation**: Pre-rendered HTML for instant loading
- **Declarative Reactivity**: Efficient updates with Svelte 5 runes
- **PMTiles Protocol**: Range request-based tile loading
- **CloudFront CDN**: Global edge caching for assets and data
- **Race Condition Prevention**: Proper async coordination for map loading

### Bundle Analysis

The build outputs client-side bundles with:
- Code splitting by route and component
- MapLibre GL JS as the largest dependency (~970KB)
- Efficient CSS extraction and minification

## Testing

### Unit Tests
```bash
npm run test:unit
```
- Component behavior and rendering
- Store state management
- Utility function logic
- Type safety validation

### E2E Tests
```bash
npm run test:e2e
```
- Authentication flows
- Map initialization and interaction
- Filter functionality
- Error handling scenarios

## Troubleshooting

### Common Issues

**Authentication Loop**: Check for proper cookie domain configuration
```javascript
// Ensure cookies work on localhost
document.cookie // Should show ridelines_auth cookie
```

**Map Loading Errors**: Verify MapTiler API key and terrain access
```javascript
// Check browser console for WebGL and network errors
```

**Type Errors**: Regenerate API types from latest OpenAPI spec
```bash
npm run generate-types
```

**API CORS Issues**: Ensure development proxy is working
```bash
# Check proxy configuration in vite.config.ts
curl http://localhost:5173/api/user # Should proxy to backend
```

### Debug Mode

Enable detailed logging:
```javascript
localStorage.setItem('debug', 'ridelines:*');
```

## Contributing

### Development Workflow

1. Create feature branch from `main`
2. Make changes with proper TypeScript types
3. Test locally with `npm run dev`
4. Run linting and type checking
5. Write tests for new functionality
6. Submit PR with clear description

### Code Standards

- Use Biome for consistent formatting
- Follow Svelte 5 runes patterns for reactivity  
- Maintain strict TypeScript configuration
- Write semantic commit messages
- Include tests for new features

### Architecture Guidelines

- Keep components focused and composable
- Use stores for cross-component state
- Implement proper error boundaries
- Follow accessibility best practices
- Optimize for performance and bundle size

## License

MIT License - see LICENSE file for details.

## Related Projects

- [Ridelines Drivetrain](../drivetrain/) - Rust backend and Lambda functions
- [Ridelines Frame](../frame/) - Infrastructure as Code with OpenTofu
- [intervals.icu](https://intervals.icu/) - Training data platform
- [MapLibre GL JS](https://maplibre.org/) - Open source mapping library
- [PMTiles](https://github.com/protomaps/PMTiles) - Efficient tile format