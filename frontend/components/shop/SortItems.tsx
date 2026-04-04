interface SortProps {
  sort: string;
  setSort: (val: string) => void;
}

const SortItems = ({ sort, setSort }: SortProps) => {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 border rounded-md">
      <span className="text-sm font-medium text-gray-500">Sort by:</span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="text-sm font-semibold outline-none cursor-pointer bg-transparent"
      >
        <option value="newest">Newest Items</option>
        <option value="priceLow">Price: Low to High</option>
        <option value="priceHigh">Price: High to Low</option>
        <option value="az">Alphabetical: A-Z</option>
        <option value="za">Alphabetical: Z-A</option>
        <option value="oldest">Oldest Items</option>
      </select>
    </div>
  );
};

export default SortItems;
