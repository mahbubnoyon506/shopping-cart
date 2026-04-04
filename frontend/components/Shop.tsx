"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { Title } from "./ui/text";
import CategoryList from "./shop/CategoryList";
import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
import { useGetProducts } from "./hooks/useFetchProducts";
import { Product } from "@/utils/types";
import ResetFilters from "./shop/ResetFilters";
import SortItems from "./shop/SortItems";

const Shop = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",") || [],
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",") || [],
  );
  const [selectedPrices, setSelectedPrices] = useState<string[]>(
    searchParams.get("price")?.split(",") || [],
  );
  const [sort, setSort] = useState<string>("newest");

  const { data, isLoading, error } = useGetProducts({
    categories: selectedCategories,
    brands: selectedBrands,
    priceRange: selectedPrices,
    sort: sort,
  });

  const products = data?.data || [];

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (selectedBrands.length > 0)
      params.set("brands", selectedBrands.join(","));
    if (selectedPrices.length > 0)
      params.set("price", selectedPrices.join(","));

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url, { scroll: false });
  }, [
    selectedCategories,
    selectedBrands,
    selectedPrices,
    sort,
    pathname,
    router,
  ]);

  console.log(selectedBrands);

  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex items-center justify-between">
            <Title className="text-lg uppercase tracking-wide">
              Get the products as your needs
            </Title>
            <div className="flex items-center gap-3">
              <ResetFilters
                setSelectedCategories={setSelectedCategories}
                setSelectedBrands={setSelectedBrands}
                setSelectedPrices={setSelectedPrices}
                setSort={setSort}
                hasFilters={
                  selectedCategories.length ||
                  selectedBrands.length ||
                  selectedPrices.length
                    ? true
                    : false
                }
              />
              <SortItems sort={sort} setSort={setSort} />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
            <CategoryList
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <BrandList
              setSelectedBrands={setSelectedBrands}
              selectedBrands={selectedBrands}
            />
            <PriceList
              setSelectedPrices={setSelectedPrices}
              selectedPrices={selectedPrices}
            />
          </div>
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {isLoading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Product is loading . . .
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products?.map((product: Product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
