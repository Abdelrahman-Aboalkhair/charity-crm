# Donor Management System - Frontend

A modern, responsive dashboard for managing donors, donations, calls, and reservations built with Next.js, Redux Toolkit, and shadcn/ui components.

## Features

- **Dashboard Overview**: Statistics and recent activity
- **Donor Management**: Complete CRUD operations for donors
- **Donation Tracking**: Manage donation status and history
- **Call Management**: Track donor communication
- **Reservation System**: Appointment scheduling
- **Location Management**: Manage donation centers
- **Responsive Design**: Works on desktop and mobile
- **Real-time Data**: RTK Query for efficient data fetching

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **State Management**: Redux Toolkit with RTK Query
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS v4
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running (see server README)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── layout/       # Layout components
├── dashboard/        # Dashboard pages
│   ├── donors/       # Donor management
│   ├── donations/    # Donation tracking
│   ├── calls/        # Call management
│   ├── reservations/ # Appointment scheduling
│   ├── locations/    # Location management
│   └── settings/     # User settings
├── store/           # Redux store and API
└── lib/             # Utility functions
```

## API Integration

The frontend integrates with your backend API using RTK Query. All API calls are automatically cached and synchronized across components.

### Available Endpoints

- **Donors**: `/api/donors`
- **Donations**: `/api/donations`
- **Calls**: `/api/calls`
- **Reservations**: `/api/reservations`
- **Locations**: `/api/locations`

## Development

### Adding New Components

1. Create components in `app/components/ui/` for reusable UI elements
2. Use shadcn/ui patterns for consistency
3. Export components with proper TypeScript types

### Adding New Pages

1. Create pages in `app/dashboard/`
2. Use the existing layout structure
3. Implement proper loading and error states
4. Add to the sidebar navigation

### Styling

- Use Tailwind CSS classes for styling
- Follow the design system defined in `globals.css`
- Use CSS variables for consistent theming

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Make sure to set the correct API URL for production:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Contributing

1. Follow the existing code patterns
2. Use TypeScript for all new code
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is part of the Donor Management System.
