"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth, setUser } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Sign In
      const res = await api.post("/auth/signin", { email, password });

      if (res.status === 200) {
        const token = res.data.token;
        setAuth(token);

        // Save token to cookie so Middleware can see it
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

        const userRes = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.status === 200) {
          const userData = {
            id: userRes.data.user._id,
            email: userRes.data.user.email,
            role: userRes.data.user.role[0],
          };

          setUser(userData);
          //   router.push(userData.role === "admin" ? "/dashboard" : "/wishlist");
        }
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-shop_light_bg font-poppins">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-shop_dark_green mb-6 text-center">
          Login to ShopCart
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded focus:outline-shop_light_green"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded focus:outline-shop_light_green"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-shop_btn_dark_green text-white p-3 rounded font-semibold hover:bg-shop_light_green transition-colors">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-lightColor text-sm">
          New here?{" "}
          <Link href="/register" className="text-shop_orange font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
