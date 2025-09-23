export interface Booking {
  id: string;
  customerId: string;
  assemblerId: string;
  serviceId: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}