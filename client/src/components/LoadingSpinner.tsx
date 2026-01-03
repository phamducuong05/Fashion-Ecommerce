const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 w-full">
      <div className="relative">
        {/* Vòng tròn mờ bên ngoài */}
        <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>

        {/* Vòng tròn xoay chính */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-indigo-600 font-medium text-sm animate-pulse">
        Finding the best outfits for you...
      </p>
    </div>
  );
};

export default LoadingSpinner;
