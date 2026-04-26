"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import OrderModal from "../components/OrderModal";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch Orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => (await api.get("/orders")).data,
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/orders/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-black text-shop_dark_green mb-6">
        Manage Orders
      </h1>

      <table className="w-full text-left">
        <thead>
          <tr className="text-lightColor border-b">
            <th className="pb-4">Order ID</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.data?.map((order: any) => (
            <tr key={order._id} className="border-b">
              <td
                className="py-4 cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                #{order.orderNumber?.slice(-6)}
              </td>
              <td className="py-4">{order.status}</td>
              <td className="py-4">
                <button
                  onClick={() => deleteMutation.mutate(order._id)}
                  className="text-shop_orange hover:underline font-bold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
