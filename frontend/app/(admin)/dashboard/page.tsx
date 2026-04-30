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
  console.log(stats, sales, overview, inventory, productStats);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-shop_dark_green">
        Dashboard Overview
      </h1>

      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.revenue || 0}`}
          change="+12.5%"
        />
        <StatCard title="Active Orders" value={stats?.activeOrders || 0} />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} />
        <StatCard title="Total Products" value={stats?.totalProducts || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-shop_dark_green mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-shop_orange rounded-full animate-pulse"></span>
            Inventory Alerts
          </h3>
          <div className="space-y-4">
            {inventory?.length > 0 ? (
              inventory.map((item: any) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-3 bg-deal-bg rounded-lg"
                >
                  <span className="text-sm font-medium text-darkColor">
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-shop_orange">
                    Only {item.stock} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-lightColor">
                All stock levels are healthy.
              </p>
            )}
          </div>
        </div>


        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
          <h3 className="font-bold text-shop_dark_green mb-4">
            Monthly Sales Growth
          </h3>
          <div className="h-full flex items-center justify-center text-lightColor italic">
  
            [Graph showing sales growth over time]
          </div>
        </div>
      </div> */}
    </div>
  );
}

// function StatCard({
//   title,
//   value,
//   change,
// }: {
//   title: string;
//   value: any;
//   change?: string;
// }) {
//   return (
//     <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-shop_light_green transition-all">
//       <p className="text-xs font-bold text-lightColor uppercase tracking-wider">
//         {title}
//       </p>
//       <div className="flex items-baseline gap-2 mt-2">
//         <h2 className="text-3xl font-black text-shop_dark_green">{value}</h2>
//         {change && (
//           <span className="text-xs font-bold text-shop_light_green">
//             {change}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }
