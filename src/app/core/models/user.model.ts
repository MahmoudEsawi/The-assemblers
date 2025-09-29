export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role: 'customer' | 'assembler';
  createdAt: Date;
  updatedAt: Date;
}