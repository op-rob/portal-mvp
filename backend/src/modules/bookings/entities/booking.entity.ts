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

  @Column()
  guestName: string;

  @Column()
  guestEmail: string;

  @Column({ nullable: true })
  guestPhone: string;

  @Column('date')
  checkInDate: Date;

  @Column('date')
  checkOutDate: Date;

  @Column()
  numberOfGuests: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cleaningFee: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  serviceFee: number;

  @Column({ default: 'confirmed' })
  status: string; // confirmed, cancelled, completed, in-progress

  @Column({ nullable: true })
  platform: string; // airbnb, vrbo, booking.com, direct

  @Column({ nullable: true })
  platformBookingId: string;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => Property, (property) => property.bookings)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}