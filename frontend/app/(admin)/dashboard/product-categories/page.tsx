"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

import { useForm } from "react-hook-form";
import ConfirmModal from "../components/ConfirmModal";

export default function ProductCategories() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => (await api.get("/categories")).data,
  });

  // Create/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingCategory)
        return api.patch(`/categories/${editingCategory._id}`, data);
      return api.post("/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      reset();
      setEditingCategory(null);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setDeletingId(null);
    },
  });
  console.log(categories);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-shop_dark_green">
        Category Management
      </h1>

      {/* Simple Form */}
      <form
        onSubmit={handleSubmit((d) => saveMutation.mutate(d))}
        className="bg-white p-6 rounded-xl border flex gap-4 items-end"
      >
        <div className="flex-1">
          <label className="text-sm font-bold text-lightColor">
            Category Name
          </label>
          <input
            {...register("title", { required: true })}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Electronics"
          />
        </div>
        <button className="bg-shop_dark_green text-white px-6 py-2 rounded-lg font-bold">
          {editingCategory ? "Update" : "Add Category"}
        </button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        {categories?.data?.map((cat: any) => (
          <div
            key={cat._id}
            className="p-4 border-b flex justify-between items-center"
          >
            <span className="font-medium text-shop_dark_green">
              {cat.title}
            </span>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setEditingCategory(cat);
                  reset(cat);
                }}
                className="text-shop_dark_green font-bold"
              >
                Edit
              </button>
              <button
                onClick={() => setDeletingId(cat._id)}
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
        title="Delete Category?"
        message="Are you sure you want to delete this category? Products associated with it might need re-assignment."
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
      />
    </div>
  );
}
