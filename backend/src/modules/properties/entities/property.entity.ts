import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { WorkOrder } from '../../work-orders/entities/work-order.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  longitude: number;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  amenities: string[];

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ default: 'active' })
  status: string;

  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @OneToMany(() => Booking, (booking) => booking.property)
  bookings: Booking[];

  @OneToMany(() => WorkOrder, (workOrder) => workOrder.property)
  workOrders: WorkOrder[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}