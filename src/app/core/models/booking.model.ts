export enum BookingStatus {
  Pending = 0,
  Confirmed = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
  Rejected = 5
}

export interface Booking {
  id: number;
  customerId: number;
  assemblerId: number;
  serviceId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  // Nested objects from API response
  customer?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    profileImage?: string;
    role: string;
    createdAt: string;
  };
  assembler?: {
    id: number;
    userId: number;
    specialization: string;
    description?: string;
    location?: string;
    averageRating: number;
    isVerified: boolean;
    createdAt: string;
    user?: {
      id: number;
      name: string;
      email: string;
      phone?: string;
      address?: string;
      profileImage?: string;
      role: string;
      createdAt: string;
    };
  };
  service?: {
    id: number;
    categoryId: number;
    assemblerId: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    averageRating: number;
    reviewCount: number;
    createdAt: string;
    category?: {
      id: number;
      name: string;
      description?: string;
      image?: string;
      createdAt: string;
    };
  };
}