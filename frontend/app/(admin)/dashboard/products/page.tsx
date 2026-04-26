"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import ProductForm from "../components/ProductForm";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Get Products
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => (await api.get("/products")).data,
  });

  // 2. Create/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingProduct)
        return api.patch(`/products/${editingProduct._id}`, data);
      return api.post("/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      closeForm();
    },
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDeletingId(null);
    },
  });

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };
  console.log(products);

  if (isLoading)
    return <p className="p-8 text-shop_dark_green">Loading inventory...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-shop_dark_green">
          Product Management
        </h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-shop_orange text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-shop_shop_orange transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Reusable Form (Shown when adding or editing) */}
      {isFormOpen && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={(data) => saveMutation.mutate(data)}
          onCancel={closeForm}
          isLoading={saveMutation.isPending}
        />
      )}

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold text-darkColor">Name</th>
              <th className="p-4 font-bold text-darkColor">Price</th>
              <th className="p-4 font-bold text-darkColor">Stock</th>
              <th className="p-4 font-bold text-darkColor text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.data?.map((p: any) => (
              <tr
                key={p._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-shop_dark_green font-medium">
                  {p.name}
                </td>
                <td className="p-4 text-shop_light_green font-bold">
                  ${p.price}
                </td>
                <td className="p-4 text-lightColor">{p.stock} units</td>
                <td className="p-4 text-right space-x-4">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setIsFormOpen(true);
                      window.scrollTo(0, 0);
                    }}
                    className="text-shop_dark_green hover:underline font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingId(p._id)}
                    className="text-shop_orange hover:underline font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-darkColor/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-xl font-black text-shop_dark_green mb-2">
              Delete Product?
            </h3>
            <p className="text-lightColor mb-6">
              Are you sure? This will remove the item from the shop permanently.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-3 font-bold text-lightColor bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingId)}
                className="flex-1 py-3 font-bold text-white bg-shop_orange rounded-xl hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
