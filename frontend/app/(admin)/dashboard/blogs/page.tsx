"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import ConfirmModal from "../components/ConfirmModal";

export default function BlogsPage() {
  const queryClient = useQueryClient();
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  // 1. Fetch Blogs
  const { data: blogs } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => (await api.get("/blogs")).data,
  });

  // 2. Create/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingBlog) return api.patch(`/blogs/${editingBlog._id}`, data);
      return api.post("/blogs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      reset();
      setEditingBlog(null);
    },
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      setDeletingId(null);
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-shop_dark_green">
        Blog Management
      </h1>

      {/* Blog Form */}
      <form
        onSubmit={handleSubmit((d) => saveMutation.mutate(d))}
        className="bg-white p-6 rounded-xl border space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            {...register("title", { required: true })}
            className="p-2 border rounded-md"
            placeholder="Blog Title"
          />
          <input
            {...register("author")}
            className="p-2 border rounded-md"
            placeholder="Author Name"
          />
        </div>
        <textarea
          {...register("content")}
          className="w-full p-2 border rounded-md"
          placeholder="Blog Content"
          rows={4}
        />
        <button className="bg-shop_dark_green text-white px-6 py-2 rounded-lg font-bold">
          {editingBlog ? "Update Blog" : "Create Blog"}
        </button>
      </form>

      {/* Blog Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold">Title</th>
              <th className="p-4 font-bold">Author</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs?.data?.map((blog: any) => (
              <tr key={blog._id} className="border-b">
                <td className="p-4">{blog.title}</td>
                <td className="p-4">{blog.author}</td>
                <td className="p-4 text-right space-x-4">
                  <button
                    onClick={() => {
                      setEditingBlog(blog);
                      reset(blog);
                    }}
                    className="text-shop_dark_green font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingId(blog._id)}
                    className="text-shop_orange font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Blog?"
        message="This will remove the blog post permanently."
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
      />
    </div>
  );
}
