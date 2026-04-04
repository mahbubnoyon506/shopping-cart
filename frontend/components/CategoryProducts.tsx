"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { useGetCategories, useGetProducts } from "./hooks/useFetchProducts";
import { Category, Product } from "@/utils/types";
interface Props {
  slug: string;
}

const CategoryProducts = ({ slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const router = useRouter();
  const { data: categories } = useGetCategories();

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  const {
    data: products,
    isLoading,
    error,
  } = useGetProducts({
    categories: [currentSlug],
  });
  console.log(categories);

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      <div className="flex flex-col md:min-w-40 border">
        {categories?.data?.map((item: Category) => (
          <Button
            onClick={() => handleCategoryChange(item?.slug as string)}
            key={item?._id}
            className={`bg-transparent border-0 p-0  rounded-none text-darkColor shadow-none hover:bg-shop_orange hover:text-white font-semibold hoverEffect border-b last:border-b-0 transition-colors capitalize ${item?.slug === currentSlug && "bg-shop_orange text-white border-shop_orange"}`}
          >
            <p className="w-full text-left px-2">{item?.title}</p>
          </Button>
        ))}
      </div>
      <div className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full">
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Product is loading...</span>
            </div>
          </div>
        ) : products?.data?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products?.data?.map((product: Product) => (
              <AnimatePresence key={product._id}>
                <motion.div>
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable
            selectedTab={currentSlug[0]}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
