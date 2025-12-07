"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";

const CartIcon = () => {
  return (
    <Link href={"/cart"} className="group relative">
      <ShoppingBag className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
    </Link>
  );
};

export default CartIcon;
