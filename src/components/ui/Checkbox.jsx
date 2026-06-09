import React from 'react';
import { cn } from '../../utils/cn';

const Checkbox = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div className={cn(
            "h-5 w-5 rounded-md border border-gray-300 bg-white transition-all duration-150 ease-in-out",
            "peer-checked:bg-primary-900 peer-checked:border-primary-900 peer-focus:ring-2 peer-focus:ring-primary-900/20",
            "group-hover:border-primary-900",
            error && "border-red-500"
          )} />
          <svg
            className="absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {label && (
          <span className="text-sm text-gray-500 leading-tight select-none">
            {label}
          </span>
        )}
      </label>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
