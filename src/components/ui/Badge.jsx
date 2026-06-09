import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-500",
    success: "bg-[#F4FAF6] text-[#2E7D32]",
    warning: "bg-orange-50 text-orange-600",
    accent: "bg-accent text-white",
    outline: "border border-gray-200 text-gray-500",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export { Badge };
