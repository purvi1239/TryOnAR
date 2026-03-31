import axios from "axios";
import { Product, ApiResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com";

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${BASE_URL}/products/search?q=${query}`
    );

    return response.data.products.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      image: item.thumbnail,
    }));
  } catch (error) {
    console.log("API Error:", error);
    return [];
  }
};