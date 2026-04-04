"use client";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const ORDER_QUERY_KEY = ["my-orders"];

export function useGetMyOrders() {
  return useQuery({
    queryKey: ORDER_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get("/orders/my-orders");
      return res.data.data;
    },
    retry: false,
  });
}
