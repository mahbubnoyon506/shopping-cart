"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function DashboardOverview() {
  // Parallel fetching of all analytics
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get("/stats").then((res) => res.data),
  });
  const { data: overview } = useQuery({
    queryKey: ["overview"],
    queryFn: () => api.get("/analytics/overview").then((res) => res.data),
  });
  const { data: sales } = useQuery({
    queryKey: ["sales"],
    queryFn: () => api.get("/analytics/sales").then((res) => res.data),
  });
  const { data: inventory } = useQuery({
    queryKey: ["inventory-alerts"],
    queryFn: () =>
      api.get("/analytics/inventory-alerts").then((res) => res.data),
  });

  const { data: productStats } = useQuery({
    queryKey: ["product-analytics"],
    queryFn: () => api.get("/analytics/products").then((res) => res.data),
  });

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-shop_dark_green">
        Executive Summary
      </h1>

      {/* 1. KPI Cards Row - Using data.counts & overview.data.overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.counts?.totalRevenue || 0}`}
          icon="💰"
          color="text-shop_light_green"
        />
        <StatCard
          title="Total Orders"
          value={overview?.data?.overview?.totalOrders || 0}
          icon="📦"
        />
        <StatCard
          title="Total Users"
          value={stats?.counts?.users || 0}
          icon="👥"
        />
        <StatCard
          title="Products"
          value={stats?.counts?.products || 0}
          icon="🏷️"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Inventory Alerts - Using inventory.data.counts */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-shop_dark_green mb-4 border-b pb-2">
            Inventory Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-xs font-bold text-red-500 uppercase">
                Out of Stock
              </p>
              <p className="text-2xl font-black text-red-700">
                {inventory?.data?.counts?.outOfStock || 0}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl">
              <p className="text-xs font-bold text-shop_orange uppercase">
                Low Stock
              </p>
              <p className="text-2xl font-black text-shop_orange">
                {inventory?.data?.counts?.lowStock || 0}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-bold text-lightColor mb-3">
              Stale Products (No sales)
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {inventory?.data?.staleProducts?.map((p: any) => (
                <div
                  key={p._id}
                  className="text-xs p-2 bg-gray-50 rounded flex justify-between border-l-2 border-shop_dark_green"
                >
                  <span className="truncate w-40">{p.name}</span>
                  <span className="font-bold">Qty: {p.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Monthly Sales Performance - Using overview.data.sales.monthlyRevenue */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-shop_dark_green mb-4">
            Monthly Revenue Trends
          </h3>
          <div className="space-y-4">
            {overview?.data?.sales?.monthlyRevenue?.map((rev: any) => (
              <div
                key={`${rev._id.month}-${rev._id.year}`}
                className="flex items-center gap-4"
              >
                <span className="w-20 text-sm font-bold text-lightColor">
                  Month {rev._id.month}
                </span>
                <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-shop_light_green h-full"
                    style={{ width: `${rev.orders > 0 ? 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-black text-shop_dark_green">
                  ${rev.revenue}
                </span>
                <span className="text-xs text-lightColor">
                  ({rev.orders} orders)
                </span>
              </div>
            ))}
            {(!overview?.data?.sales?.monthlyRevenue ||
              overview?.data?.sales?.monthlyRevenue.length === 0) && (
              <p className="text-center py-10 text-lightColor italic">
                No sales data available for this period.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4. Recent Order Status Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-shop_dark_green mb-4">
          Order Status Breakdown
        </h3>
        <div className="flex gap-8">
          {overview?.data?.sales?.orderStatusBreakdown?.map((status: any) => (
            <div key={status._id} className="flex flex-col">
              <span className="text-xs font-bold text-lightColor uppercase">
                {status._id}
              </span>
              <span className="text-2xl font-black text-shop_dark_green">
                {status.count}
              </span>
              <span className="text-xs text-shop_light_green">
                ${status.totalValue} Value
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-shop_dark_green" }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-lightColor uppercase tracking-widest">
          {title}
        </p>
        <h2 className={`text-2xl font-black mt-1 ${color}`}>{value}</h2>
      </div>
      <div className="text-2xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-xl">
        {icon}
      </div>
    </div>
  );
}
