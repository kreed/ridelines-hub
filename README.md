# Ridelines Hub

A high-performance SvelteKit web application for visualizing GPS activities on stunning 3D terrain maps using MapLibre GL JS and PMTiles.

## Overview

Ridelines Hub is the frontend component of the Ridelines ecosystem, providing an interactive 3D visualization of GPS activities. It renders cycling, running, hiking, and skiing activities on realistic terrain with smooth performance and beautiful aesthetics.

### Key Features

- **3D Terrain Visualization**: Realistic terrain rendering with MapLibre GL JS globe projection
- **Activity Type Filtering**: Interactive filtering for rides, runs, walks, hikes, and alpine skiing
- **Optimized Performance**: PMTiles protocol for efficient vector tile delivery
- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Type-Safe Development**: Full TypeScript coverage with comprehensive type definitions
- **Modern Stack**: SvelteKit 2.0 with static adapter for optimal performance

## Technology Stack

- **Framework**: SvelteKit 2.0 with TypeScript
- **Mapping**: MapLibre GL JS v4 with PMTiles support
- **Build Tool**: Vite 5 with static adapter
- **Code Quality**: Biome for lightning-fast linting and formatting
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Styling**: Custom CSS with CSS variables for theming

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Development Setup

1. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/yourusername/ridelines.git
   cd ridelines/hub
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Run tests**:
   ```bash
   npm run test:unit    # Unit tests with Vitest
   npm run test:e2e     # E2E tests with Playwright
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module replacement |
| `npm run build` | Build production-ready static site |
| `npm run preview` | Preview production build locally |
| `npm run check` | Type-check TypeScript and Svelte components |
| `npm run lint` | Lint code with Biome |
| `npm run format` | Format code with Biome |
| `npm run test:unit` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |

## Project Structure

```
hub/
├── src/
│   ├── lib/
│   │   ├── components/         # Reusable Svelte components
│   │   │   ├── ActivityMap.svelte      # Main 3D map component
│   │   │   ├── FilterPanel.svelte      # Activity type filters
│   │   │   ├── ErrorMessage.svelte     # Error display
│   │   │   └── icons/                  # SVG activity icons
│   │   ├── stores/            # Svelte stores for state management
│   │   │   └── activities.ts          # Activity filter state
│   │   ├── types/             # TypeScript type definitions
│   │   │   └── activities.ts          # Activity data types
│   │   └── constants.ts       # Application constants
│   ├── routes/                # SvelteKit pages and layouts
│   │   ├── +layout.svelte            # Root layout
│   │   ├── +page.svelte              # Home page
│   │   └── +page.ts                  # Page load function
│   ├── app.d.ts              # Global TypeScript declarations
│   └── app.html              # HTML template
├── static/                    # Static assets
├── tests/                     # Test suites
│   ├── unit/                 # Vitest unit tests
│   └── e2e/                  # Playwright E2E tests
├── biome.jsonc               # Biome configuration
├── playwright.config.ts      # Playwright configuration
├── svelte.config.js         # SvelteKit configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Architecture

### Component Architecture

The application follows a component-based architecture with clear separation of concerns:

- **ActivityMap**: Core map component handling MapLibre GL JS integration
  - Manages map initialization and lifecycle
  - Handles PMTiles data source configuration
  - Implements 3D terrain and sky rendering
  - Provides smooth navigation controls

- **FilterPanel**: Activity filtering interface
  - Toggles for each activity type
  - Real-time map filtering without re-rendering
  - Persistent filter state via Svelte stores

- **ErrorMessage**: Graceful error handling
  - User-friendly error display
  - Fallback UI for loading states

### Data Flow

1. **Page Load**: SvelteKit loads the application shell
2. **Map Initialization**: MapLibre GL JS initializes with terrain
3. **Data Loading**: PMTiles loaded from CloudFront CDN
4. **Rendering**: Vector tiles rendered with activity-specific styling
5. **Interaction**: User filters update map visibility in real-time

### State Management

- **Svelte Stores**: Reactive state management for filters
- **URL State**: Filter preferences can be persisted in URL
- **Local Storage**: Optional persistence of user preferences

## Configuration

### Environment Variables

Create a `.env` file for local development:

```env
PUBLIC_MAPLIBRE_STYLE_URL=https://your-style-url
PUBLIC_ACTIVITIES_URL=https://your-cloudfront-distribution/activities.pmtiles
```

### MapLibre Configuration

The map is configured in `ActivityMap.svelte` with:

- **Style**: Protomaps Patchwork style for beautiful base maps
- **Terrain**: MapTiler terrain tiles for 3D elevation
- **Projection**: Globe projection for stunning visuals
- **Controls**: Navigation and scale controls

## Data Format

The application expects PMTiles containing GeoJSON LineString features with these properties:

```typescript
interface ActivityProperties {
  activity_type: 'Ride' | 'Run' | 'Walk' | 'Hike' | 'AlpineSki' | 'Other';
  start_date_local: string;  // ISO 8601 format
  distance: number;          // meters
  elapsed_time: number;      // seconds
}
```

## Styling

### Activity Type Colors

| Activity | Color | Hex |
|----------|-------|-----|
| Ride | Blue | `#0066ff` |
| Run | Green | `#00aa00` |
| Walk | Orange | `#ff8800` |
| Hike | Brown | `#aa6600` |
| AlpineSki | Purple | `#aa00ff` |
| Other | Gray | `#888888` |

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Performance Optimization

- **Static Generation**: Pre-rendered HTML for instant loading
- **Code Splitting**: Automatic code splitting by SvelteKit
- **Tree Shaking**: Unused code eliminated during build
- **Compression**: Brotli compression via CloudFront
- **Caching**: Aggressive caching for static assets
- **PMTiles**: Efficient tile format with HTTP range requests

## Testing

### Unit Tests (Vitest)

```bash
npm run test:unit
```

Tests cover:
- Component rendering
- Store behavior
- Utility functions
- Type safety

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

Tests cover:
- Page loading
- Map initialization
- Filter interactions
- Error states

## Deployment

The application is packaged as a static site and deployed via the Frame infrastructure:

1. **Build**: GitHub Actions builds the static site
2. **Package**: Artifacts packaged to GitHub Container Registry
3. **Deploy**: Frame deploys to S3 + CloudFront

### Build Output

The build creates a static site in the `build/` directory:

```
build/
├── _app/              # JavaScript and CSS bundles
├── index.html         # Pre-rendered HTML
└── [other assets]     # Fonts, images, etc.
```

## Troubleshooting

### Common Issues

1. **Map doesn't load**: Check browser console for CORS or network errors
2. **Activities not visible**: Verify PMTiles URL is accessible
3. **Performance issues**: Ensure hardware acceleration is enabled
4. **Type errors**: Run `npm run check` to validate types

### Debug Mode

Enable debug logging in the browser console:
```javascript
localStorage.debug = 'ridelines:*'
```

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Use Biome for formatting (runs automatically)
- Follow SvelteKit conventions
- Maintain TypeScript strict mode
- Write meaningful commit messages

## License

MIT License - see the [LICENSE](../LICENSE) file for details.

## Links

- [Backend (Drivetrain)](https://github.com/kreed/ridelines-drivetrain/)
- [Infrastructure (Frame)](https://github.com/kreed/ridelines-frame/)
- [MapLibre GL JS](https://maplibre.org/)
- [PMTiles Specification](https://github.com/protomaps/PMTiles)