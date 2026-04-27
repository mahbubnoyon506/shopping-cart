"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-darkColor/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl scale-in-center">
        <div className="w-16 h-16 bg-shop_light_pink rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-shop_orange"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-black text-shop_dark_green mb-2">
          {title}
        </h3>
        <p className="text-lightColor mb-6 text-sm">{message}</p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 font-bold text-lightColor bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 font-bold text-white bg-shop_orange rounded-xl hover:bg-red-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
