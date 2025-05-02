# AgriTech Platform Architecture Reorganization

## Overview

The AgriTech platform has been reorganized from a traditional type-based architecture to a feature-based architecture to improve maintainability, scalability, and developer productivity.

## Key Changes

1. **Feature-Based Organization**: Code is now organized by business domain/feature rather than by technical type, keeping related code together.

2. **Component Relocation**: Components have been moved from general directories (like `components/`) to feature-specific directories.

3. **API Reorganization**: API code has been moved closer to the features that use it, improving code locality.

4. **Shared Components**: Truly reusable components have been moved to a shared directory that can be imported by any feature.

5. **Clear Boundaries**: Each feature has clearly defined boundaries and dependencies, improving code organization.

## Directory Structure

The new structure follows this pattern:

```
src/
  ├── features/             # Feature modules organized by domain
  │   ├── auth/             # Authentication feature
  │   ├── dashboard/        # Dashboard feature
  │   ├── weather/          # Weather feature
  │   ├── climate/          # Climate feature
  │   ├── farms/            # Farm management
  │   ├── marketplace/      # Marketplace
  │   ├── resources/        # Resources
  │   ├── sustainability/   # Sustainability tracking
  │   ├── ai/               # AI assistant feature
  │   └── shared/           # Cross-feature shared code
  │
  ├── lib/                  # Core libraries and config
  ├── assets/               # Static assets
  ├── App.tsx               # Main App component
  └── main.tsx              # Entry point
```

Each feature contains its own components, API calls, and hooks, organized by their relation to the feature rather than their technical type.

## Benefits

- **Improved Code Organization**: Related code stays together, making it easier to find and work with.
- **Better Discoverability**: Developers can quickly locate all code related to a specific feature.
- **Enhanced Maintainability**: Changes to one feature are isolated from others, reducing unintended side effects.
- **Clearer Dependencies**: The relationship between different parts of the application is more explicit.
- **Easier Onboarding**: New developers can understand the application structure more intuitively.
- **Parallel Development**: Different teams can work on different features with minimal conflicts.

## Migration Status

The migration to the new architecture is complete. Key components have been moved to their respective feature directories:

- Dashboard and its related components
- Weather API and components
- Climate API and components
- AI assistant components and API
- Shared UI components (Button, Card, DataCard, etc.)

See the `ARCHITECTURE.md` file for more detailed information about the architecture principles and guidelines. 