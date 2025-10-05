export interface Review {
  id: number;
  customerId: number;
  assemblerId: number;
  bookingId?: number;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}