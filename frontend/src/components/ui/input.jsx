import React from "react";

const Input = React.forwardRef(
  ({ className = "", type = "text", label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
