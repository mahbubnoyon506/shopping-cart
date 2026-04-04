import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const BRANDS_QUERY_KEY = ["brands-query"];

export function useGetBrands() {
  return useQuery({
    queryKey: BRANDS_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get("/brands");
      return res.data;
    },
    retry: false,
  });
}
