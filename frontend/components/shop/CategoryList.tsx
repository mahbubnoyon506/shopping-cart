import React from "react";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Title } from "../ui/text";
import { Category } from "@/utils/types";
import { useGetCategories } from "../hooks/useFetchProducts";

interface Props {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoryList = ({ selectedCategories, setSelectedCategories }: Props) => {
  const { data: categories } = useGetCategories();

  const handleToggle = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  return (
    <div className="w-full bg-white p-5 border-b">
      <Title className="text-base font-black uppercase mb-4">Categories</Title>
      <div className="flex flex-col gap-3">
        {categories?.data?.map((category: Category) => (
          <div key={category?._id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={category?.slug}
              checked={selectedCategories.includes(category?.slug)}
              onChange={() => handleToggle(category?.slug)}
              className="w-4 h-4 accent-shop_dark_green cursor-pointer"
            />
            <Label
              htmlFor={category?.slug}
              className={`cursor-pointer ${selectedCategories.includes(category?.slug) ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {category?.title}
            </Label>
          </div>
        ))}
      </div>
      {selectedCategories.length > 0 && (
        <button
          onClick={() => setSelectedCategories([])}
          className="text-xs text-red-500 mt-4 underline"
        >
          Reset Categories
        </button>
      )}
    </div>
  );
};

export default CategoryList;
