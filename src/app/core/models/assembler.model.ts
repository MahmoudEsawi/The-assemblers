import { User } from './user.model';

export interface DayAvailability {
  start: string;
  end: string;
  available: boolean;
}

export interface Availability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface Assembler extends User {
  specialization: string;
  description: string;
  averageRating: number;
  profileImage: string;
  coverImage?: string;
  location: string;
  isVerified: boolean;
  availability?: Availability;
}