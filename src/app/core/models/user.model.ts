export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  role: 'Customer' | 'Assembler';
  createdAt: string;
  updatedAt: string;
}