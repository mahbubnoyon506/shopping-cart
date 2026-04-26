export default function OrderModal({
  order,
  onClose,
}: {
  order: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-shop_dark_green">
            Order Details
          </h2>
          <button onClick={onClose} className="text-shop_orange">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Total:</strong> ${order.totalPrice}
          </p>

          <h3 className="font-bold border-t pt-4">Items:</h3>
          {order?.products?.map((item: any) => (
            <div
              key={item?.product?._id}
              className="flex justify-between text-sm"
            >
              <span>
                {item?.product?.name} (x{item?.quantity})
              </span>
              <span>${item?.product?.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
