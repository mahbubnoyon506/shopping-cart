import { Button } from "../ui/button";

interface ResetProps {
  setSelectedCategories: (val: string[]) => void;
  setSelectedBrands: (val: string[]) => void;
  setSelectedPrices: (val: string[]) => void;
  setSort: (val: string) => void;
  hasFilters: boolean;
}

const ResetFilters = ({
  setSelectedCategories,
  setSelectedBrands,
  setSelectedPrices,
  hasFilters,
}: ResetProps) => {
  console.log(hasFilters);
  if (!hasFilters) return null;

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPrices([]);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleReset}
      className="text-sm font-bold text-red-600"
    >
      Reset Filters
    </Button>
  );
};

export default ResetFilters;
