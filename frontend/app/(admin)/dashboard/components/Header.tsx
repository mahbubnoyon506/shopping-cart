export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <h2 className="text-darkColor font-bold">Admin Panel</h2>
      <div className="flex items-center gap-4">
        <button className="text-shop_orange font-semibold text-sm hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
}
