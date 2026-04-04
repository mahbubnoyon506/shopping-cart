"use client";
import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import { useAuthStore } from "@/store/authStore";
import React from "react";

const WishListPage = () => {
  const { token, user } = useAuthStore();
  console.log(token);

  return (
    <>
      {token ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Log in to view your wishlist items. Don’t miss out on your cart products to make the payment!" />
      )}
    </>
  );
};

export default WishListPage;
