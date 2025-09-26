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

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ default: 'pending' })
  status: string; // pending, in-progress, completed, cancelled

  @Column({ default: 'low' })
  priority: string; // low, medium, high, urgent

  @Column()
  category: string; // maintenance, cleaning, repair, inspection

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actualCost: number;

  @Column({ nullable: true })
  contractorName: string;

  @Column({ nullable: true })
  contractorPhone: string;

  @Column({ nullable: true })
  contractorEmail: string;

  @Column('date', { nullable: true })
  scheduledDate: Date;

  @Column('date', { nullable: true })
  completedDate: Date;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => Property, (property) => property.workOrders)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}