export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'assembler';
  createdAt: Date;
  updatedAt: Date;
}