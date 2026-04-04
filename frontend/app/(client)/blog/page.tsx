"use client";
import Container from "@/components/Container";
import { useGetBlogs } from "@/components/hooks/useFetchBlogs";
import { Title } from "@/components/ui/text";
import { Blog } from "@/utils/types";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogPage = () => {
  const { data: blogs, isLoading, isError } = useGetBlogs();

  return (
    <div>
      <Container>
        <Title>Blog page</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 md:mt-10">
          {blogs?.data?.map((blog: Blog) => (
            <div key={blog?._id} className="rounded-md overflow-hidden group">
              {blog?.mainImage && (
                <Image
                  src={blog?.mainImage}
                  alt="blogImage"
                  width={500}
                  height={500}
                  className="w-full max-h-80 object-cover"
                />
              )}
              <div className="bg-gray-100 p-5">
                <div className="text-xs flex items-center gap-5">
                  <div className="flex items-center relative group cursor-pointer">
                    {blog?.blogcategories?.map((item, index) => (
                      <p
                        key={index}
                        className="font-semibold text-shop_dark_green tracking-wider"
                      >
                        {item?.title}
                      </p>
                    ))}
                    <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hover:cursor-pointer hoverEffect" />
                  </div>
                  <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
                    <Calendar size={15} />{" "}
                    {dayjs(blog.publishedAt).format("MMMM D, YYYY")}
                    <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
                  </p>
                </div>
                <Link
                  href={`/blog/${blog?.slug}`}
                  className="text-base font-bold tracking-wide mt-5 line-clamp-2 hover:text-shop_dark_green hoverEffect"
                >
                  {blog?.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
