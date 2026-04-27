"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import ConfirmModal from "../components/ConfirmModal";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Fetch Users
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await api.get("/users")).data,
  });

  // 2. Patch Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      return api.patch(`/users/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDeletingId(null);
    },
  });

  if (isLoading)
    return (
      <div className="p-8 text-shop_dark_green font-bold">Loading users...</div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-shop_dark_green">
        User Management
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold text-darkColor">Name & Email</th>
              <th className="p-4 font-bold text-darkColor">Current Role</th>
              <th className="p-4 font-bold text-darkColor">Change Role</th>
              <th className="p-4 font-bold text-darkColor text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.data?.map((user: any) => (
              <tr
                key={user._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <p className="font-bold text-shop_dark_green">{user.name}</p>
                  <p className="text-xs text-lightColor">{user.email}</p>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === "admin"
                        ? "bg-shop_light_pink text-shop_orange"
                        : "bg-gray-100 text-lightColor"
                    }`}
                  >
                    {/* {user.role} */}
                    {user.role[0].toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRoleMutation.mutate({
                        id: user._id,
                        role: e.target.value,
                      })
                    }
                    className="p-1 border rounded text-sm bg-transparent focus:ring-2 focus:ring-shop_light_green outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => setDeletingId(user._id)}
                    className="text-shop_orange hover:underline font-bold text-sm"
                  >
                    Remove User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete User?"
        message="Are you sure? This user will lose all access to their account and order history."
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
