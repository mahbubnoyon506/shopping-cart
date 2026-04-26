"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      name: "",
      price: "",
      category: "",
      stock: "",
    },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-xl border"
    >
      <h3 className="text-xl font-black text-shop_dark_green mb-4">
        {initialData ? "Update Product" : "Add New Product"}
      </h3>
      <div>
        <label className="text-sm font-bold text-lightColor">
          Product Name
        </label>
        <input
          {...register("name")}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-lightColor">Price ($)</label>
          <input
            type="number"
            {...register("price")}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="text-sm font-bold text-lightColor">Stock</label>
          <input
            type="number"
            {...register("stock")}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-shop_dark_green text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : initialData
              ? "Update Product"
              : "Create Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-lightColor font-bold px-4"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
