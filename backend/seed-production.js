// Production seed script for OwnerPulse Database
// This script can be run against the production Supabase database

const { Client } = require('pg');

// Sample data for seeding
const SAMPLE_DATA = {
  users: [
    {
      email: 'rob@ownerpulse.ai',
      first_name: 'Rob',
      last_name: 'Hajek',
      phone: '+1-555-0101',
      auth0_id: 'auth0|' + Math.random().toString(36).substring(7), // Generate random for demo
      role: 'owner',
      is_active: true
    }
  ],
  properties: [
    {
      name: 'Luxury Lakefront Cabin',
      address: '123 Lake View Drive',
      city: 'South Lake Tahoe',
      state: 'CA',
      zip_code: '96150',
      latitude: 38.9399,
      longitude: -119.9772,
      bedrooms: 3,
      bathrooms: 2,
      description: 'Beautiful lakefront cabin with stunning views and modern amenities.',
      amenities: 'WiFi,Hot Tub,Fireplace,Kitchen,Parking,Lake Access,Deck',
      images: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800,https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      status: 'active'
    },
    {
      name: 'Downtown Loft',
      address: '456 Urban Street, Unit 3A',
      city: 'Austin',
      state: 'TX',
      zip_code: '78701',
      latitude: 30.2672,
      longitude: -97.7431,
      bedrooms: 2,
      bathrooms: 2,
      description: 'Modern downtown loft in the heart of Austin.',
      amenities: 'WiFi,AC,Kitchen,Rooftop Access,Gym,Concierge',
      images: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800,https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      status: 'active'
    },
    {
      name: 'Beachfront Villa',
      address: '789 Ocean Boulevard',
      city: 'Miami Beach',
      state: 'FL',
      zip_code: '33139',
      latitude: 25.7907,
      longitude: -80.1300,
      bedrooms: 4,
      bathrooms: 3,
      description: 'Stunning beachfront villa with private beach access.',
      amenities: 'Beach Access,Pool,WiFi,AC,Kitchen,Parking,Balcony',
      images: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800,https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      status: 'active'
    }
  ],
  bookings: [
    {
      guest_name: 'Sarah Johnson',
      guest_email: 'sarah.j@email.com',
      guest_phone: '+1-555-2001',
      check_in_date: '2025-01-15',
      check_out_date: '2025-01-19',
      number_of_guests: 4,
      total_amount: 1200.00,
      cleaning_fee: 150.00,
      service_fee: 120.00,
      status: 'confirmed',
      platform: 'airbnb',
      platform_booking_id: 'ABNB-12345'
    },
    {
      guest_name: 'Mike Chen',
      guest_email: 'mike.chen@email.com',
      guest_phone: '+1-555-2002',
      check_in_date: '2025-02-01',
      check_out_date: '2025-02-07',
      number_of_guests: 2,
      total_amount: 2100.00,
      cleaning_fee: 200.00,
      service_fee: 210.00,
      status: 'confirmed',
      platform: 'vrbo',
      platform_booking_id: 'VRBO-67890'
    }
  ],
  workOrders: [
    {
      title: 'HVAC System Maintenance',
      description: 'Annual HVAC system inspection and filter replacement.',
      status: 'completed',
      priority: 'medium',
      category: 'maintenance',
      estimated_cost: 250.00,
      actual_cost: 275.00,
      contractor_name: 'Mountain Air Services',
      contractor_phone: '+1-555-3001',
      contractor_email: 'service@mountainair.com',
      scheduled_date: '2024-11-15',
      completed_date: '2024-11-15',
      notes: 'Replaced all filters, cleaned ducts, system running efficiently'
    },
    {
      title: 'Hot Tub Repair',
      description: 'Hot tub heater not working properly.',
      status: 'in-progress',
      priority: 'high',
      category: 'repair',
      estimated_cost: 400.00,
      contractor_name: 'Spa Solutions LLC',
      contractor_phone: '+1-555-3002',
      contractor_email: 'repairs@spasolutions.com',
      scheduled_date: '2025-01-05',
      notes: 'Heater element replacement needed. Parts ordered.'
    }
  ]
};

async function seedProductionDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'aws-1-us-east-2.pooler.supabase.com',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USERNAME || 'postgres.wvzwwhdftfncjmeannxs',
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔌 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected to database!');

    // Create tables if they don't exist
    console.log('🏗️  Creating tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE NOT NULL,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        phone VARCHAR,
        auth0_id VARCHAR UNIQUE NOT NULL,
        role VARCHAR DEFAULT 'owner',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        address VARCHAR NOT NULL,
        city VARCHAR NOT NULL,
        state VARCHAR NOT NULL,
        zip_code VARCHAR NOT NULL,
        latitude DECIMAL(10,7),
        longitude DECIMAL(10,7),
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        description TEXT,
        amenities TEXT,
        images TEXT,
        status VARCHAR DEFAULT 'active',
        owner_id uuid REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        guest_name VARCHAR NOT NULL,
        guest_email VARCHAR NOT NULL,
        guest_phone VARCHAR,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        number_of_guests INTEGER NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        cleaning_fee DECIMAL(10,2),
        service_fee DECIMAL(10,2),
        status VARCHAR DEFAULT 'confirmed',
        platform VARCHAR,
        platform_booking_id VARCHAR,
        notes TEXT,
        property_id uuid REFERENCES properties(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS work_orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR DEFAULT 'pending',
        priority VARCHAR DEFAULT 'low',
        category VARCHAR NOT NULL,
        estimated_cost DECIMAL(10,2),
        actual_cost DECIMAL(10,2),
        contractor_name VARCHAR,
        contractor_phone VARCHAR,
        contractor_email VARCHAR,
        scheduled_date DATE,
        completed_date DATE,
        images TEXT,
        notes TEXT,
        property_id uuid REFERENCES properties(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tables created successfully!');

    // Check if data already exists
    const existingUsers = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) > 0) {
      console.log('📊 Data already exists, skipping seed...');
      return;
    }

    // Seed users
    console.log('👥 Seeding users...');
    let userIds = [];
    for (const user of SAMPLE_DATA.users) {
      const result = await client.query(
        `INSERT INTO users (email, first_name, last_name, phone, auth0_id, role, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [user.email, user.first_name, user.last_name, user.phone, user.auth0_id, user.role, user.is_active]
      );
      userIds.push(result.rows[0].id);
    }
    console.log(`✅ Created ${userIds.length} users`);

    // Seed properties
    console.log('🏠 Seeding properties...');
    let propertyIds = [];
    for (let i = 0; i < SAMPLE_DATA.properties.length; i++) {
      const property = SAMPLE_DATA.properties[i];
      const ownerId = userIds[i % userIds.length];
      const result = await client.query(
        `INSERT INTO properties (name, address, city, state, zip_code, latitude, longitude, bedrooms, bathrooms, description, amenities, images, status, owner_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
        [property.name, property.address, property.city, property.state, property.zip_code, 
         property.latitude, property.longitude, property.bedrooms, property.bathrooms, 
         property.description, property.amenities, property.images, property.status, ownerId]
      );
      propertyIds.push(result.rows[0].id);
    }
    console.log(`✅ Created ${propertyIds.length} properties`);

    // Seed bookings
    console.log('📅 Seeding bookings...');
    for (let i = 0; i < SAMPLE_DATA.bookings.length; i++) {
      const booking = SAMPLE_DATA.bookings[i];
      const propertyId = propertyIds[i % propertyIds.length];
      await client.query(
        `INSERT INTO bookings (guest_name, guest_email, guest_phone, check_in_date, check_out_date, number_of_guests, total_amount, cleaning_fee, service_fee, status, platform, platform_booking_id, property_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [booking.guest_name, booking.guest_email, booking.guest_phone, booking.check_in_date, 
         booking.check_out_date, booking.number_of_guests, booking.total_amount, booking.cleaning_fee,
         booking.service_fee, booking.status, booking.platform, booking.platform_booking_id, propertyId]
      );
    }
    console.log(`✅ Created ${SAMPLE_DATA.bookings.length} bookings`);

    // Seed work orders
    console.log('🔧 Seeding work orders...');
    for (let i = 0; i < SAMPLE_DATA.workOrders.length; i++) {
      const workOrder = SAMPLE_DATA.workOrders[i];
      const propertyId = propertyIds[i % propertyIds.length];
      await client.query(
        `INSERT INTO work_orders (title, description, status, priority, category, estimated_cost, actual_cost, contractor_name, contractor_phone, contractor_email, scheduled_date, completed_date, notes, property_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [workOrder.title, workOrder.description, workOrder.status, workOrder.priority, 
         workOrder.category, workOrder.estimated_cost, workOrder.actual_cost, workOrder.contractor_name,
         workOrder.contractor_phone, workOrder.contractor_email, workOrder.scheduled_date, 
         workOrder.completed_date, workOrder.notes, propertyId]
      );
    }
    console.log(`✅ Created ${SAMPLE_DATA.workOrders.length} work orders`);

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed
if (require.main === module) {
  // Use environment variables from Render
  process.env.DB_HOST = 'aws-1-us-east-2.pooler.supabase.com';
  process.env.DB_PORT = '5432';
  process.env.DB_USERNAME = 'postgres.wvzwwhdftfncjmeannxs';
  process.env.DB_PASSWORD = 'knw!yze-hcm7jgx5JPW';
  process.env.DB_NAME = 'postgres';

  seedProductionDatabase()
    .then(() => {
      console.log('✅ Seed completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

module.exports = { seedProductionDatabase };

