import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PRODUCTS_QUERY_KEY = ["products-query"];
const CATEGORIES_QUERY_KEY = ["products-categories"];

// Add a default empty object to the argument
export function useGetProducts(
  filters: {
    categories?: string[];
    brands?: string[];
    priceRange?: string[];
    sort?: string;
  } = {},
) {
  // <--- Added default empty object here
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Use optional chaining and nullish coalescing
      if (filters?.categories?.length)
        params.append("categories", filters.categories.join(","));
      if (filters?.brands?.length)
        params.append("brands", filters.brands.join(","));
      if (filters?.priceRange?.length)
        params.append("priceRange", filters.priceRange.join(","));
      if (filters?.sort) params.append("sort", filters.sort);

      const res = await api.get(`/products?${params.toString()}`);
      return res.data;
    },
    retry: false,
  });
}

export async function getProductBySlug(slug: string) {
  try {
    const res = await api.get(`products/${slug}`);
    return res.data.data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export function useGetCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
    retry: false,
  });
}
