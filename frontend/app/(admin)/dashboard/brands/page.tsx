"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

import { useForm } from "react-hook-form";
import ConfirmModal from "../components/ConfirmModal";

export default function BrandsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  const { data: brands } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: async () => (await api.get("/brands")).data,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingId) return api.patch(`/brands/${editingId}`, data);
      return api.post("/brands", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      reset();
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/brands/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      setDeletingId(null);
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-shop_dark_green">
        Brand Management
      </h1>

      {/* Brand Form */}
      <form
        onSubmit={handleSubmit((d) => saveMutation.mutate(d))}
        className="bg-white p-6 rounded-xl border flex gap-4 items-end"
      >
        <div className="flex-1">
          <label className="text-sm font-bold text-lightColor">
            Brand Name
          </label>
          <input
            {...register("title", { required: true })}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Apple"
          />
        </div>
        <button className="bg-shop_dark_green text-white px-6 py-2 rounded-lg font-bold">
          {editingId ? "Update Brand" : "Add Brand"}
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        {brands?.data?.map((brand: any) => (
          <div
            key={brand._id}
            className="p-4 border-b flex justify-between items-center"
          >
            <span className="font-medium text-shop_dark_green">
              {brand.title}
            </span>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setEditingId(brand._id);
                  reset(brand);
                }}
                className="text-shop_dark_green font-bold"
              >
                Edit
              </button>
              <button
                onClick={() => setDeletingId(brand._id)}
                className="text-shop_orange font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Brand?"
        message="Are you sure you want to delete this brand?"
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
      />
    </div>
  );
}
