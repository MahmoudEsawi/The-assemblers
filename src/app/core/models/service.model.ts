export interface Service {
  Id: number;
  Name: string;
  Description: string;
  ImageUrl: string;
  Price: number;
  CategoryId: number;
  Category?: {
    Id: number;
    Name: string;
    Description: string;
    Image: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  AssemblerId: number;
  AverageRating?: number;
  ReviewCount?: number;
  CreatedAt: string;
  UpdatedAt: string;
}