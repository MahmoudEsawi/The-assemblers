export interface Review {
  id: string;
  customerId: string;
  assemblerId: string;
  bookingId?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}