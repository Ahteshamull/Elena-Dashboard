import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-900 text-white hover:bg-primary-800 focus:ring-primary-900",
    secondary: "bg-accent text-primary-900 hover:bg-accent-hover focus:ring-accent",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-primary-900 focus:ring-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 text-primary-900 focus:ring-gray-200",
  };

  const sizes = {
    default: "h-10 py-2 px-6",
    sm: "h-8 px-4 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
