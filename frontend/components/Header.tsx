"use client";
import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";

import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { LayoutDashboard, Logs } from "lucide-react";
import FavoriteButton from "./FavouriteButton";
import CartIcon from "./CartIcon";
import { useAuthStore } from "@/store/authStore";

import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const menuItems = [
    {
      id: 1,
      name: "Profile",
      href: "/profile",
      icon: <UserIcon />,
    },
    {
      id: 2,
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard />,
      adminOnly: true,
    },
    {
      id: 3,
      name: "Orders",
      href: "/orders",
      icon: <Logs />,
    },
    {
      id: 4,
      name: "Settings",
      href: "/settings",
      icon: <SettingsIcon />,
    },
  ];
  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && user?.role === "admin"),
  );
  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className=" cursor-pointer" asChild>
                  <UserIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {filteredMenuItems.map((menu) => (
                    <DropdownMenuItem
                      onClick={() => router.push(menu.href)}
                      key={menu.id}
                      className=" cursor-pointer"
                    >
                      {menu.icon}
                      {menu.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className=" cursor-pointer"
                    variant="destructive"
                    onClick={logout}
                  >
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
