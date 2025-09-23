export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  categoryName: string;
  assemblerId: string;
  averageRating?: number;
  reviewCount?: number;
}