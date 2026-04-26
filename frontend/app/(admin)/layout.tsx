import Header from "./dashboard/components/Header";
import Sidebar from "./dashboard/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-shop_light_bg font-poppins">
      {/* Sidebar - Fixed width */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
