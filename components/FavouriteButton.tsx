import { Heart } from "lucide-react";
import React from "react";

const FavouriteButton = () => {
  return (
    <div>
      <button className="group relative hover:text-shop_light_green hoverEffect border border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm">
        <Heart className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5 w-5 h-5" />
      </button>
    </div>
  );
};

export default FavouriteButton;
