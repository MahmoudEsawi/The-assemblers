import { User } from './user.model';

export interface DayAvailability {
  Id: number;
  Start: string;
  End: string;
  Available: boolean;
  DayOfWeek: number;
  AssemblerId: number;
}

export interface Assembler {
  Id: number;
  UserId: number;
  User?: {
    Id: number;
    Name: string;
    Email: string;
    Phone: string;
    Address: string;
    ProfileImage: string;
    Role: string;
    CreatedAt: string;
  };
  Specialization: string;
  Description: string;
  AverageRating: number;
  CoverImage?: string;
  Location: string;
  IsVerified: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  Availability?: DayAvailability[];
}