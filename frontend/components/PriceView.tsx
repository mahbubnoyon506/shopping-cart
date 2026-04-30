import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number | undefined;
  discount: number | undefined;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        {price && discount && (
          <PriceFormatter
            amount={price - (discount * price) / 100}
            className={cn("text-shop_dark_green", className)}
          />
        )}
        <PriceFormatter
          amount={price}
          className={twMerge(
            "line-through text-xs font-normal text-zinc-500",
            className,
          )}
        />
      </div>
    </div>
  );
};

export default PriceView;
