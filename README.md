# Mini Guestbook App - Frontend

A modern, responsive guestbook application built with Next.js, TypeScript, and shadcn/ui for recording event attendees with real-time analytics and seamless backend integration.

## Live Demo

- **Frontend**: [https://fe-mini-guestbook-app-production.up.railway.app/](https://fe-mini-guestbook-app-production.up.railway.app/) (Production)
- **Backend API**: [https://be-mini-guestbook-app-production.up.railway.app/api](https://be-mini-guestbook-app-production.up.railway.app/api) (Production)
- **API Documentation**: [https://be-mini-guestbook-app-production.up.railway.app/api-docs](https://be-mini-guestbook-app-production.up.railway.app/api-docs) (Swagger UI)
- **WebSocket**: `wss://be-mini-guestbook-app-production.up.railway.app` (Production)

## Features

### Core Business Features

- **Event Management**: Create, manage, and complete events with real-time status tracking
- **Guest Registration**: Add guests with name and gender information using intuitive forms
- **Real-time Analytics**: Live guest counters and hourly registration trends with WebSocket updates
- **Event Timer**: Track event duration with live updates and automatic completion after 24 hours
- **Data Export**: Download complete guest lists as CSV files for completed events
- **Guest Management**: View, add, and remove guests with instant updates across all connected clients

### Technical Features

- **Modern Stack**: Next.js 16 with App Router, TypeScript, and Tailwind CSS v4
- **Real-time Updates**: WebSocket integration for live data synchronization
- **State Management**: React Query (TanStack Query) for efficient data fetching and caching
- **UI Components**: shadcn/ui with Material Design 3 principles and custom theming
- **Responsive Design**: Mobile-first approach with seamless desktop and mobile experience
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Performance**: Optimized with React.memo, useMemo, and useCallback for smooth interactions

## Project Structure

```
fe-mini-guestbook-app/
├── app/                           # Next.js App Router pages
│   ├── page.tsx                   # Home page (event creation)
│   ├── event/[id]/
│   │   └── page.tsx              # Event dashboard with real-time updates
│   ├── globals.css               # Global styles and Tailwind imports
│   └── layout.tsx                # Root layout with providers
├── components/                    # Reusable UI components
│   ├── ui/                       # shadcn/ui component library
│   │   ├── alert-dialog.tsx      # Confirmation dialogs
│   │   ├── button.tsx            # Button variants
│   │   ├── card.tsx              # Card layouts
│   │   ├── input.tsx             # Form inputs
│   │   └── toaster.tsx           # Toast notifications
│   ├── AnalyticsChart.tsx        # Real-time analytics visualization
│   ├── EventTimer.tsx            # Live event duration timer
│   └── GuestCounters.tsx         # Guest statistics display
├── lib/                          # Core application logic
│   ├── api-client.ts             # Axios HTTP client with interceptors
│   ├── config.ts                 # Environment configuration
│   ├── types.ts                  # TypeScript type definitions
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-events.ts         # Event management hooks
│   │   ├── use-guests.ts         # Guest management hooks
│   │   └── use-websocket.ts      # WebSocket connection management
│   └── providers/
│       └── query-provider.tsx    # React Query provider setup
└── public/                       # Static assets and icons
```

### Architecture Layers

- **Presentation Layer**: React components with shadcn/ui and Tailwind CSS
- **State Management**: React Query for server state, React hooks for local state
- **Data Layer**: Axios HTTP client with WebSocket integration
- **Type Layer**: TypeScript interfaces and enums for type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 3001

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/fachrinfl/fe-mini-guestbook-app.git
   cd fe-mini-guestbook-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   # Create .env.local file for development
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
   echo "NEXT_PUBLIC_WS_URL=ws://localhost:3001" >> .env.local

   # For production, the app automatically uses:
   # NEXT_PUBLIC_API_URL=https://be-mini-guestbook-app-production.up.railway.app/api
   # NEXT_PUBLIC_WS_URL=wss://be-mini-guestbook-app-production.up.railway.app
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API Docs: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

### Backend Integration

This frontend is designed to work with the Mini Guestbook Backend API. Ensure the backend is running:

```bash
# In a separate terminal
cd ../be-mini-guestbook-app
npm run dev
```

## Usage Guide

### Creating an Event

1. **Navigate to the home page**
2. **Enter an event name** in the input field
3. **Click "Start Event"** to create and navigate to the event dashboard
4. **View real-time updates** as the event timer starts

### Managing Guests

1. **In the event dashboard**, use the "Add New Guest" form
2. **Enter guest name** and select gender (Male/Female)
3. **Click "Add Guest"** to register the guest
4. **View live updates** in the guest list and counters
5. **Remove guests** using the trash icon (if needed)

### Event Management

- **Complete Event**: Mark the event as completed to enable CSV download
- **Reset Guests**: Clear all guests while keeping the event active (with confirmation)
- **Download CSV**: Export guest data (available for completed events only)
- **Back to Home**: Navigate back with automatic event completion

### Real-time Features

- **Live Counters**: Total, male, and female guest counts update instantly
- **Guest List**: New guests appear immediately without refresh
- **Analytics Chart**: Hourly registration trends update in real-time
- **Event Timer**: Live duration tracking with automatic completion

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# Type checking
npm run type-check   # Run TypeScript compiler check
```

### Adding New Components

The project uses shadcn/ui for consistent component design:

```bash
# Add new shadcn/ui components
npx shadcn@latest add [component-name]

# Example: Add a dialog component
npx shadcn@latest add dialog
```

### State Management

The application uses React Query for server state management:

```typescript
// Example: Using event hooks
const { data: events, isLoading } = useEvents();
const createEventMutation = useCreateEvent();

// Example: Creating an event
createEventMutation.mutate(
  { name: "My Event" },
  {
    onSuccess: (newEvent) => {
      router.push(`/event/${newEvent.id}`);
    },
  }
);
```

### WebSocket Integration

Real-time updates are handled through WebSocket connections:

```typescript
// Example: Using WebSocket hook
const { isConnected } = useWebSocket(eventId);

// Automatic updates for:
// - Guest additions/removals
// - Event completion
// - Analytics updates
```

## API Integration

### Backend Requirements

- **Base URL**: `https://be-mini-guestbook-app-production.up.railway.app/api` (Production)
- **WebSocket URL**: `wss://be-mini-guestbook-app-production.up.railway.app` (Production)
- **Development URLs**: `http://localhost:3001/api` and `ws://localhost:3001`
- **Authentication**: None (for demo purposes)
- **CORS**: Configured for both localhost:3000 and production domain

### Key Endpoints

- `GET /events` - Fetch all events
- `POST /events` - Create new event
- `GET /events/:id` - Get event details with analytics
- `PATCH /events/:id/complete` - Complete event
- `POST /events/:id/reset` - Reset all guests
- `GET /events/:id/export` - Download CSV
- `POST /events/:id/guests` - Add guest
- `DELETE /events/:id/guests/:guestId` - Remove guest

## Styling & Theming

### Design System

- **Framework**: Tailwind CSS v4 with custom configuration
- **Components**: shadcn/ui with Material Design 3 principles
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualization
- **Colors**: Custom color palette with dark mode support

### Customization

```css
/* Global styles in globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS variables for theming */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more custom properties */
}
```

## Performance Optimizations

### React Optimizations

- **React.memo**: Prevents unnecessary re-renders
- **useMemo**: Memoizes expensive calculations
- **useCallback**: Memoizes event handlers
- **Code splitting**: Automatic with Next.js App Router

### Data Fetching

- **React Query**: Intelligent caching and background updates
- **Stale-while-revalidate**: Shows cached data while fetching fresh data
- **Optimistic updates**: Immediate UI updates for better UX
- **Error boundaries**: Graceful error handling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Mini Guestbook App** - Modern event management with real-time analytics and seamless user experience.
