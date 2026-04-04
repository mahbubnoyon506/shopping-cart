import { api } from "@/lib/api";
import { Blog } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

const BLOGS_QUERY_KEY = ["blogs-query"];

export function useGetBlogs() {
  return useQuery({
    queryKey: BLOGS_QUERY_KEY,
    queryFn: async () => {
      const res = await api.get("/blogs");
      return res.data;
    },
    retry: false,
  });
}

export async function getSingleBlog(slug: string) {
  try {
    const res = await api.get(`/blogs/${slug}`);
    return res.data.data;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function getSimilarBlogs(slug: string) {
  try {
    const res = await api.get(`/blogs`);
    return res.data.data.filter((item: Blog) => item.slug !== slug);
  } catch (error) {
    console.log(error);
    return {};
  }
}
export async function getBlogCategories() {
  try {
    const res = await api.get(`/blogs/categories`);
    return res.data.data;
  } catch (error) {
    console.log(error);
    return {};
  }
}
