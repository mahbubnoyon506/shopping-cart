"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Orders", path: "/dashboard/orders" },
  { name: "Products", path: "/dashboard/products" },
  { name: "Product Categories", path: "/dashboard/product-categories" },
  { name: "Users", path: "/dashboard/users" },
  { name: "Blogs", path: "/dashboard/blogs" },
  { name: "Blog Categories", path: "/dashboard/blog-categories" },
];

export default function Sidebar() {
  const pathName = usePathname();

  return (
    <aside className="w-64 bg-shop_dark_green text-white hidden md:flex flex-col">
      <div className="p-6 text-2xl font-black text-white">SHOPCART</div>
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`block py-3 px-6 hover:bg-shop_light_green transition-all border-l-4 hover:border-shop_orange ${pathName === item.path ? "bg-shop_light_green border-shop_orange" : "border-transparent"}`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
