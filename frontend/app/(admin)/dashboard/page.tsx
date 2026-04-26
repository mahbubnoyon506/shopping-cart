export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-black text-shop_dark_green mb-6">
        Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-lightColor text-sm">Total Orders</p>
          <h3 className="text-3xl font-black text-shop_dark_green mt-2">
            1,284
          </h3>
        </div>
        {/* Add more cards here */}
      </div>
    </div>
  );
}
