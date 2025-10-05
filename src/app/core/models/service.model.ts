export interface Service {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
  assemblerId: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}