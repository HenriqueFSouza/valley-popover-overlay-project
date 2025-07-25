# Valley Challenge - Content Management Dashboard

React application for AI training conversations and message threads with real-time data fetching.

## Technical Approach

**Architecture**: Clean layered architecture with separation of concerns

- **API Layer**: Next.js routes with mock data
- **Service Layer**: HTTP clients with error handling
- **Hook Layer**: SWR for data fetching and caching
- **Component Layer**: React components with TypeScript

**Stack**: Next.js 14, TypeScript, SWR, Tailwind CSS, shadcn/ui

**Data Flow**: `Components → SWR Hooks → Services → API Routes`

## Component Structure

```
PopoverOverlay
├── HeaderSection (navigation)
├── ContentSection (tabs: AITraining, Messages)
└── ProfileSection (user details)
```

**Organization Rationale**:

- Single responsibility per component
- Separation of data hooks (`useProfile`, `useAITraining`, `useMessages`) from action hooks (`useAITrainingActions`, `useMessageActions`)
- Entity-based folder structure (`profiles/`, `ai-training/`, `messages/`)

## Assumptions & Edge Cases

**Assumptions**:

- Mock API data (database integration pending)
- Default profileId for demonstration

**Edge Case Handling**:

- Network failures: Automatic retry with exponential backoff
- Loading states: Skeleton components to prevent layout shifts
- Empty data: Graceful empty state messages
- Type safety: Comprehensive null/undefined checking

## Future Refactoring

- Layout improvments based on Figma
- React.memo and useMemo optimizations for performance
- Virtual scrolling for large datasets
- Improve cache performance with swr

## Getting Started

```bash
pnpm install
pnpm dev
```

**Commands**: `pnpm dev` | `pnpm build` | `pnpm type-check` | `pnpm lint`
