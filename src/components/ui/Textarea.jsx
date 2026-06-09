import React from 'react';
import { cn } from '../../utils/cn';

const Textarea = React.forwardRef(({ className, error, maxLength, value = '', onChange, ...props }, ref) => {
  const currentLength = value?.length || 0;

  return (
    <div className="relative w-full">
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={cn(
          "flex min-h-[160px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 ease-in-out resize-none",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {maxLength && (
        <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-400">
          {currentLength}/{maxLength}
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
