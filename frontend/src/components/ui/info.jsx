import React from 'react';
import { FaSearch } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";

const Info = ({ title, subTitle }) => {
  return (
    <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center py-8 gap-6">
      {/* Left side - Title & Subtitle */}
      <div>
        <h1 className="text-4xl font-semibold text-black dark:text-gray-300 mb-1">{title}</h1>
        <span className="text-gray-600 dark:text-gray-500">{subTitle}</span>
      </div>

      {/* Right side - Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2">
          <FaSearch className="text-xl text-gray-600 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search now..."
            className="bg-transparent outline-none text-gray-700 dark:text-white placeholder:text-sm placeholder:text-gray-400 w-40 md:w-60"
          />
        </div>
        <button className="flex items-center gap-2 bg-black dark:bg-violet-800 py-2 px-4 rounded text-white hover:bg-opacity-90">
          <IoFilter size={20} className="hover:animate-bounce" />
          <span className="text-sm font-medium">Filter By</span>
        </button>
      </div>
    </div>
  );
};

export default Info;
