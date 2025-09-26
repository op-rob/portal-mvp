# OwnerPulse PoC Setup Guide

## Quick Start (Local Development)

### 1. Environment Setup

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

### 2. Database Options

#### Option A: Docker PostgreSQL (Recommended for PoC)
```bash
# From project root
npm run docker:up
```
This will start PostgreSQL, backend, and frontend services.

#### Option B: Supabase (Production-ready)
1. Create a Supabase project at https://supabase.com
2. Get your connection details
3. Update `.env` files with Supabase credentials
4. Run locally without Docker:
```bash
npm run dev
```

### 3. Auth0 Setup (Optional for initial testing)

1. Create Auth0 account at https://auth0.com
2. Create a new application (Single Page Application)
3. Create an API
4. Update both frontend and backend `.env` files with Auth0 credentials

## Development Workflow

### Start Development Servers
```bash
# Option 1: Both services with concurrently
npm run dev

# Option 2: Separate terminals
npm run dev:backend
npm run dev:frontend

# Option 3: Docker (full environment)
npm run docker:up
```

### API Testing

The backend will be available at http://localhost:3001/api

**Test Endpoints:**
```bash
# Health check
curl http://localhost:3001/api

# Get all properties (will be empty initially)
curl http://localhost:3001/api/properties

# Create a test property (requires user first)
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Property",
    "address": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "bedrooms": 3,
    "bathrooms": 2,
    "ownerId": "test-user-id"
  }'
```

### Frontend Access

The frontend will be available at http://localhost:3000

## Current PoC Features

✅ **Completed:**
- [x] Project structure with monorepo
- [x] NestJS backend with TypeORM + PostgreSQL
- [x] Refine frontend with shadcn/ui
- [x] Database schema design
- [x] Properties API endpoints
- [x] Docker configuration
- [x] Development environment setup

🚧 **Next Steps:**
- [ ] Auth0 integration
- [ ] Bookings and Work Orders APIs
- [ ] Refine dashboard pages
- [ ] Sample data seeding
- [ ] Production deployment setup

## Architecture Overview

```
Frontend (React + Refine)     Backend (NestJS)          Database
┌─────────────────────┐      ┌─────────────────────┐    ┌─────────────┐
│                     │      │                     │    │             │
│ - Property List     │◄────►│ - Properties API    │    │ PostgreSQL  │
│ - Booking Calendar  │      │ - Bookings API      │◄──►│             │
│ - Work Orders       │      │ - Work Orders API   │    │ - users     │
│ - Auth (Auth0)      │      │ - Auth Middleware   │    │ - properties│
│                     │      │                     │    │ - bookings  │
└─────────────────────┘      └─────────────────────┘    │ - work_orders│
                                                          └─────────────┘
```

## Troubleshooting

### Common Issues:

1. **Port conflicts:** Backend runs on 3001, frontend on 3000
2. **Database connection:** Ensure PostgreSQL is running (docker-compose handles this)
3. **Node version:** Use Node 18+ 
4. **Dependencies:** Run `npm install` in both backend and frontend directories

### Logs:
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Local development
# Backend logs appear in terminal
# Frontend logs appear in browser console
```