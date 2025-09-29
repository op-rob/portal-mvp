import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'guest_name' })
  guestName: string;

  @Column({ name: 'guest_email' })
  guestEmail: string;

  @Column({ name: 'guest_phone', nullable: true })
  guestPhone: string;

  @Column({ name: 'check_in_date', type: 'date' })
  checkInDate: Date;

  @Column({ name: 'check_out_date', type: 'date' })
  checkOutDate: Date;

  @Column({ name: 'number_of_guests' })
  numberOfGuests: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ name: 'cleaning_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  cleaningFee: number;

  @Column({ name: 'service_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  serviceFee: number;

  @Column({ default: 'confirmed' })
  status: string; // confirmed, cancelled, completed, in-progress

  @Column({ nullable: true })
  platform: string; // airbnb, vrbo, booking.com, direct

  @Column({ name: 'platform_booking_id', nullable: true })
  platformBookingId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Property, (property) => property.bookings)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'property_id' })
  propertyId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}