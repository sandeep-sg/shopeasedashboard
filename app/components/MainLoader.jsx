import React from "react";

const MainLoader = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-opacity-70 z-50">
      <div className="w-12 h-12 border-4 border-[#FF8904] border-t-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};
export default MainLoader;
