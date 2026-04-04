import React from "react";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Title } from "../ui/text";

const priceArray = [
  { title: "Under $100", value: "0-100" },
  { title: "$100 - $200", value: "100-200" },
  { title: "$200 - $300", value: "200-300" },
  { title: "$300 - $500", value: "300-500" },
  { title: "Over $500", value: "500-10000" },
];

interface Props {
  selectedPrices: string[];
  setSelectedPrices: React.Dispatch<React.SetStateAction<string[]>>;
}

const PriceList = ({ selectedPrices, setSelectedPrices }: Props) => {
  const handleToggle = (val: string) => {
    setSelectedPrices((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
  };

  return (
    <div className="w-full bg-white p-5 border-b">
      <Title className="text-base font-black uppercase mb-4">Price Range</Title>
      <div className="flex flex-col gap-3">
        {priceArray.map((price) => (
          <div key={price.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`price-${price.value}`}
              checked={selectedPrices.includes(price.value)}
              onChange={() => handleToggle(price.value)}
              className="w-4 h-4 accent-shop_dark_green cursor-pointer"
            />
            <Label
              htmlFor={`price-${price.value}`}
              className={`cursor-pointer ${selectedPrices.includes(price.value) ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {price.title}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceList;
