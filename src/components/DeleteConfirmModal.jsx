export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  productTitle,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#ebebeb] rounded-[12px] w-full max-w-sm p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in fade-in zoom-in-95 duration-150">
        <div className="w-10 h-10 rounded-full bg-red-50 text-[#ee0000] flex items-center justify-center mb-4 border border-red-100">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        <h3 className="text-sm font-semibold text-[#171717]">Delete Product</h3>
        <p className="text-xs text-[#4d4d4d] mt-1.5 leading-relaxed">
          Are you sure you want to delete{" "}
          <strong className="text-[#171717]">"{productTitle}"</strong>? This
          will remove the item from your inventory overview.
        </p>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1.5 text-xs border border-[#ebebeb] rounded-md bg-white text-[#4d4d4d] hover:text-[#171717] font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-3.5 py-1.5 text-xs bg-[#ee0000] text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading && (
              <svg
                className="animate-spin h-3 w-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
