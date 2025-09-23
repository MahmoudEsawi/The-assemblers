import { User } from './user.model';

export interface Assembler extends User {
  specialization: string;
  description: string;
  averageRating: number;
  profileImage: string;
  coverImage?: string;
  location: string;
  isVerified: boolean;
}