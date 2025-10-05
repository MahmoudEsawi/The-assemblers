import { User } from './user.model';

export interface DayAvailability {
  id: number;
  start: string;
  end: string;
  available: boolean;
  dayOfWeek: number;
  assemblerId: number;
}

export interface Assembler {
  id: number;
  userId: number;
  user?: User;
  specialization: string;
  description: string;
  averageRating: number;
  coverImage?: string;
  location: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  availability?: DayAvailability[];
}