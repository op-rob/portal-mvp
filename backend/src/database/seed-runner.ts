import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Property } from '../modules/properties/entities/property.entity';
import { Booking } from '../modules/bookings/entities/booking.entity';
import { WorkOrder } from '../modules/work-orders/entities/work-order.entity';
import { seedDatabase } from './seed';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ownerpulse',
  entities: [User, Property, Booking, WorkOrder],
  synchronize: true, // Create tables if they don't exist
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  extra: process.env.NODE_ENV === 'production' ? {
    family: 4, // Force IPv4
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 10,
  } : {},
});

async function runSeed() {
  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected successfully!');

    await seedDatabase(dataSource);

    console.log('🔌 Closing database connection...');
    await dataSource.destroy();
    console.log('✅ Seed completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runSeed();
}
