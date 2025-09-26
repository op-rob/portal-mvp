# OwnerPulse

A web portal for property owners to view bookings, work orders, and property updates from their Short Term Rental management companies.

## Tech Stack

- **Frontend**: Refine.dev (Open Source) with TypeScript and React
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Auth0
- **Deployment**: Docker containers on AWS

## Project Structure

```
OwnerPulse/
├── frontend/          # Refine.dev React application
├── backend/           # NestJS API server
├── docker-compose.yml # Local development environment
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Supabase account
- Auth0 account

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - **Important**: Configure Auth0 credentials (see [AUTH0_SETUP.md](./AUTH0_SETUP.md))
   - Configure database credentials

4. Start development servers:
   ```bash
   npm run dev
   ```

5. Or run with Docker:
   ```bash
   npm run docker:up
   ```

## Core Features (PoC)

- [x] Property owner authentication (Auth0)
- [x] Property dashboard view
- [ ] Booking calendar and details
- [ ] Work order notifications and status
- [x] Owner profile management

## API Endpoints

- `GET /properties` - List owner's properties
- `GET /properties/:id/bookings` - Property bookings
- `GET /properties/:id/workorders` - Property work orders
- `GET /users/profile` - Owner profile

## Environment Variables

See `.env.example` files in frontend and backend directories.