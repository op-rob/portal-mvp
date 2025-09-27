import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Property } from '../modules/properties/entities/property.entity';
import { Booking } from '../modules/bookings/entities/booking.entity';
import { WorkOrder } from '../modules/work-orders/entities/work-order.entity';

// Sample data for seeding
const SAMPLE_USERS = [
  {
    email: 'rob@ownerpulse.ai',
    firstName: 'Rob',
    lastName: 'Hajek',
    phone: '+1-555-0101',
    auth0Id: 'auth0|64f8a5b2c1234567890abcde', // This will be updated with real Auth0 ID
    role: 'owner',
  },
  {
    email: 'demo.owner@example.com',
    firstName: 'Demo',
    lastName: 'Owner',
    phone: '+1-555-0102',
    auth0Id: 'auth0|demo123456789abcdef',
    role: 'owner',
  },
];

const SAMPLE_PROPERTIES = [
  {
    name: 'Luxury Lakefront Cabin',
    address: '123 Lake View Drive',
    city: 'South Lake Tahoe',
    state: 'CA',
    zipCode: '96150',
    latitude: 38.9399,
    longitude: -119.9772,
    bedrooms: 3,
    bathrooms: 2,
    description: 'Beautiful lakefront cabin with stunning views and modern amenities. Perfect for families and groups looking for a mountain getaway.',
    amenities: ['WiFi', 'Hot Tub', 'Fireplace', 'Kitchen', 'Parking', 'Lake Access', 'Deck'],
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    status: 'active',
  },
  {
    name: 'Downtown Loft',
    address: '456 Urban Street, Unit 3A',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    latitude: 30.2672,
    longitude: -97.7431,
    bedrooms: 2,
    bathrooms: 2,
    description: 'Modern downtown loft in the heart of Austin. Walking distance to restaurants, bars, and live music venues.',
    amenities: ['WiFi', 'AC', 'Kitchen', 'Rooftop Access', 'Gym', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    status: 'active',
  },
  {
    name: 'Beachfront Villa',
    address: '789 Ocean Boulevard',
    city: 'Miami Beach',
    state: 'FL',
    zipCode: '33139',
    latitude: 25.7907,
    longitude: -80.1300,
    bedrooms: 4,
    bathrooms: 3,
    description: 'Stunning beachfront villa with private beach access. Luxury amenities and breathtaking ocean views.',
    amenities: ['Beach Access', 'Pool', 'WiFi', 'AC', 'Kitchen', 'Parking', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    status: 'active',
  },
  {
    name: 'Mountain Retreat',
    address: '321 Alpine Way',
    city: 'Aspen',
    state: 'CO',
    zipCode: '81611',
    latitude: 39.1911,
    longitude: -106.8175,
    bedrooms: 5,
    bathrooms: 4,
    description: 'Luxurious mountain retreat with ski-in/ski-out access. Perfect for winter sports and summer hiking.',
    amenities: ['Ski Access', 'Hot Tub', 'Fireplace', 'WiFi', 'Kitchen', 'Parking', 'Mountain Views'],
    images: ['https://images.unsplash.com/photo-1551524164-6cf71c7fa335?w=800', 'https://images.unsplash.com/photo-1448906654166-444d494666b3?w=800'],
    status: 'active',
  },
];

const SAMPLE_BOOKINGS = [
  // Recent and upcoming bookings
  {
    guestName: 'Sarah Johnson',
    guestEmail: 'sarah.j@email.com',
    guestPhone: '+1-555-2001',
    checkInDate: new Date('2025-01-15'),
    checkOutDate: new Date('2025-01-19'),
    numberOfGuests: 4,
    totalAmount: 1200.00,
    cleaningFee: 150.00,
    serviceFee: 120.00,
    status: 'confirmed',
    platform: 'airbnb',
    platformBookingId: 'ABNB-12345',
  },
  {
    guestName: 'Mike Chen',
    guestEmail: 'mike.chen@email.com',
    guestPhone: '+1-555-2002',
    checkInDate: new Date('2025-02-01'),
    checkOutDate: new Date('2025-02-07'),
    numberOfGuests: 2,
    totalAmount: 2100.00,
    cleaningFee: 200.00,
    serviceFee: 210.00,
    status: 'confirmed',
    platform: 'vrbo',
    platformBookingId: 'VRBO-67890',
  },
  {
    guestName: 'Emma Rodriguez',
    guestEmail: 'emma.r@email.com',
    guestPhone: '+1-555-2003',
    checkInDate: new Date('2024-12-01'),
    checkOutDate: new Date('2024-12-05'),
    numberOfGuests: 6,
    totalAmount: 1800.00,
    cleaningFee: 175.00,
    serviceFee: 180.00,
    status: 'completed',
    platform: 'booking.com',
    platformBookingId: 'BDC-54321',
  },
];

const SAMPLE_WORK_ORDERS = [
  {
    title: 'HVAC System Maintenance',
    description: 'Annual HVAC system inspection and filter replacement. Check all vents and ensure optimal performance for upcoming bookings.',
    status: 'completed',
    priority: 'medium',
    category: 'maintenance',
    estimatedCost: 250.00,
    actualCost: 275.00,
    contractorName: 'Mountain Air Services',
    contractorPhone: '+1-555-3001',
    contractorEmail: 'service@mountainair.com',
    scheduledDate: new Date('2024-11-15'),
    completedDate: new Date('2024-11-15'),
    notes: 'Replaced all filters, cleaned ducts, system running efficiently',
  },
  {
    title: 'Hot Tub Repair',
    description: 'Hot tub heater not working properly. Guests reported lukewarm water temperature.',
    status: 'in-progress',
    priority: 'high',
    category: 'repair',
    estimatedCost: 400.00,
    contractorName: 'Spa Solutions LLC',
    contractorPhone: '+1-555-3002',
    contractorEmail: 'repairs@spasolutions.com',
    scheduledDate: new Date('2025-01-05'),
    notes: 'Heater element replacement needed. Parts ordered.',
  },
  {
    title: 'Deep Cleaning Service',
    description: 'Post-checkout deep cleaning for luxury suite. Focus on kitchen, bathrooms, and balcony areas.',
    status: 'pending',
    priority: 'high',
    category: 'cleaning',
    estimatedCost: 300.00,
    contractorName: 'Premium Clean Co',
    contractorPhone: '+1-555-3003',
    contractorEmail: 'bookings@premiumclean.com',
    scheduledDate: new Date('2025-01-08'),
    notes: 'Schedule after current guest checkout at 11 AM',
  },
];

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Starting database seed...');

  const userRepository = dataSource.getRepository(User);
  const propertyRepository = dataSource.getRepository(Property);
  const bookingRepository = dataSource.getRepository(Booking);
  const workOrderRepository = dataSource.getRepository(WorkOrder);

  try {
    // Clear existing data (optional - remove in production)
    console.log('🗑️  Clearing existing data...');
    await workOrderRepository.delete({});
    await bookingRepository.delete({});
    await propertyRepository.delete({});
    await userRepository.delete({});

    // Seed Users
    console.log('👥 Seeding users...');
    const users = await userRepository.save(SAMPLE_USERS);
    console.log(`✅ Created ${users.length} users`);

    // Seed Properties
    console.log('🏠 Seeding properties...');
    const propertiesWithOwners = SAMPLE_PROPERTIES.map((property, index) => ({
      ...property,
      ownerId: users[index % users.length].id, // Distribute properties among users
    }));
    const properties = await propertyRepository.save(propertiesWithOwners);
    console.log(`✅ Created ${properties.length} properties`);

    // Seed Bookings
    console.log('📅 Seeding bookings...');
    const bookingsWithProperties = SAMPLE_BOOKINGS.map((booking, index) => ({
      ...booking,
      propertyId: properties[index % properties.length].id,
    }));
    const bookings = await bookingRepository.save(bookingsWithProperties);
    console.log(`✅ Created ${bookings.length} bookings`);

    // Seed Work Orders
    console.log('🔧 Seeding work orders...');
    const workOrdersWithProperties = SAMPLE_WORK_ORDERS.map((workOrder, index) => ({
      ...workOrder,
      propertyId: properties[index % properties.length].id,
    }));
    const workOrders = await workOrderRepository.save(workOrdersWithProperties);
    console.log(`✅ Created ${workOrders.length} work orders`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Summary:
   👥 Users: ${users.length}
   🏠 Properties: ${properties.length}
   📅 Bookings: ${bookings.length}
   🔧 Work Orders: ${workOrders.length}
`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

export default seedDatabase;

