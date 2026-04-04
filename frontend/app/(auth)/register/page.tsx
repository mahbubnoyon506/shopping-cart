"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Title } from "@/components/ui/text";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", formData);
      console.log(res);

      if (res.data.success) {
        router.push("/login"); // Redirect to login after successful signup
      }
    } catch (err) {
      console.error("Registration failed", err);
    } finally {
      setLoading(false);
    }
  };
  console.log(formData);

  return (
    <div className="min-h-screen flex items-center justify-center bg-shop_light_bg font-poppins px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md border border-gray-100">
        <Title className="text-2xl font-black text-shop_dark_green mb-2 text-center">
          Create Account
        </Title>
        <p className="text-lightColor text-sm text-center mb-8">
          Join ShopCart and start shopping!
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-shop_dark_green">
              Role
            </label>
            <input
              type="text"
              placeholder="Admin, or User"
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_light_green transition-all"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-shop_dark_green">
              Email Address
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_light_green transition-all"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-shop_dark_green">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_light_green transition-all"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-shop_btn_dark_green text-white p-4 rounded-lg font-bold hover:bg-shop_light_green transition-all transform active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-lightColor text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-shop_orange font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
