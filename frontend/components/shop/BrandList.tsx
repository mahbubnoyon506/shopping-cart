import React from "react";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Title } from "../ui/text";
import { Brand } from "@/utils/types";
import { useGetBrands } from "../hooks/useFetchBrands";

interface Props {
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
}

const BrandList = ({ selectedBrands, setSelectedBrands }: Props) => {
  const { data: brands } = useGetBrands();

  const handleToggle = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  return (
    <div className="w-full bg-white p-5 border-b">
      <Title className="text-base font-black uppercase mb-4">Brands</Title>
      <div className="flex flex-col gap-3">
        {brands?.data?.map((brand: Brand) => (
          <div key={brand?._id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={brand?.slug}
              checked={selectedBrands.includes(brand?.slug)}
              onChange={() => handleToggle(brand?.slug)}
              className="w-4 h-4 accent-shop_dark_green cursor-pointer"
            />
            <Label
              htmlFor={brand?.slug}
              className={`cursor-pointer ${selectedBrands.includes(brand?.slug) ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {brand?.title}
            </Label>
          </div>
        ))}
      </div>
      {selectedBrands.length > 0 && (
        <button
          onClick={() => setSelectedBrands([])}
          className="text-xs text-red-500 mt-4 underline"
        >
          Reset Brands
        </button>
      )}
    </div>
  );
};

export default BrandList;
