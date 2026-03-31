export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export interface ApiResponse {
  products: {
    id: number;
    title: string;
    price: number;
    description: string;
    thumbnail: string;
  }[];
}