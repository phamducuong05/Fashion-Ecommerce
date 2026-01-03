interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
      {/* Icon Cảnh báo đỏ */}
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {/* Thông báo lỗi */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-8">
        {message ||
          "We couldn't load the products. Please check your connection and try again."}
      </p>

      {/* Nút thử lại */}
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg shadow-sm hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
};
