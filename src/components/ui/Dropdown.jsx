import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export const Dropdown = ({ trigger, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 z-[100] overflow-hidden animate-in fade-in zoom-in duration-150 origin-top-right">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, icon: Icon, variant = 'default' }) => {
  const variants = {
    default: "text-gray-700 hover:bg-gray-50 hover:text-primary-900",
    danger: "text-red-600 hover:bg-red-50 hover:text-red-700",
    success: "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
        variants[variant]
      )}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};
