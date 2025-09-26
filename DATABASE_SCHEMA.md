# Database Schema

## Overview
The OwnerPulse database schema supports a property management platform with the following core entities:

## Tables

### users
- `id` (UUID, Primary Key)
- `email` (Unique, String) - User's email address
- `firstName` (String) - User's first name
- `lastName` (String) - User's last name  
- `phone` (String, Optional) - User's phone number
- `auth0Id` (Unique, String) - Auth0 user identifier
- `role` (String, Default: 'owner') - User role
- `isActive` (Boolean, Default: true) - Account status
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### properties
- `id` (UUID, Primary Key)
- `name` (String) - Property name/title
- `address` (String) - Street address
- `city` (String) - City
- `state` (String) - State
- `zipCode` (String) - ZIP code
- `latitude` (Decimal, Optional) - GPS latitude
- `longitude` (Decimal, Optional) - GPS longitude
- `bedrooms` (Integer) - Number of bedrooms
- `bathrooms` (Integer) - Number of bathrooms
- `description` (Text, Optional) - Property description
- `amenities` (Array, Optional) - List of amenities
- `images` (Array, Optional) - List of image URLs
- `status` (String, Default: 'active') - Property status
- `ownerId` (UUID, Foreign Key → users.id)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### bookings
- `id` (UUID, Primary Key)
- `guestName` (String) - Guest name
- `guestEmail` (String) - Guest email
- `guestPhone` (String, Optional) - Guest phone
- `checkInDate` (Date) - Check-in date
- `checkOutDate` (Date) - Check-out date
- `numberOfGuests` (Integer) - Number of guests
- `totalAmount` (Decimal) - Total booking amount
- `cleaningFee` (Decimal, Optional) - Cleaning fee
- `serviceFee` (Decimal, Optional) - Service fee
- `status` (String, Default: 'confirmed') - Booking status
- `platform` (String, Optional) - Booking platform (Airbnb, VRBO, etc.)
- `platformBookingId` (String, Optional) - External booking ID
- `notes` (Text, Optional) - Additional notes
- `propertyId` (UUID, Foreign Key → properties.id)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### work_orders
- `id` (UUID, Primary Key)
- `title` (String) - Work order title
- `description` (Text) - Detailed description
- `status` (String, Default: 'pending') - Status (pending, in-progress, completed, cancelled)
- `priority` (String, Default: 'low') - Priority level (low, medium, high, urgent)
- `category` (String) - Category (maintenance, cleaning, repair, inspection)
- `estimatedCost` (Decimal, Optional) - Estimated cost
- `actualCost` (Decimal, Optional) - Actual cost
- `contractorName` (String, Optional) - Contractor name
- `contractorPhone` (String, Optional) - Contractor phone
- `contractorEmail` (String, Optional) - Contractor email
- `scheduledDate` (Date, Optional) - Scheduled date
- `completedDate` (Date, Optional) - Completion date
- `images` (Array, Optional) - Work order images
- `notes` (Text, Optional) - Additional notes
- `propertyId` (UUID, Foreign Key → properties.id)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Relationships

- **users → properties**: One-to-Many (One user can own multiple properties)
- **properties → bookings**: One-to-Many (One property can have multiple bookings)  
- **properties → work_orders**: One-to-Many (One property can have multiple work orders)

## Indexes

Recommended indexes for performance:
- `users.email` (Unique)
- `users.auth0Id` (Unique)
- `properties.ownerId`
- `bookings.propertyId`
- `bookings.checkInDate`, `bookings.checkOutDate` (Composite)
- `work_orders.propertyId`
- `work_orders.status`
- `work_orders.priority`