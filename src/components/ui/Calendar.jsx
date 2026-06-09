import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const Calendar = ({ className }) => {
  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const dates = [
    { value: 28, inactive: true }, { value: 29, inactive: true }, { value: 30, inactive: true }, { value: 31, inactive: true },
    { value: 1, selected: true }, { value: 2, selected: true }, { value: 3, selected: true },
    { value: 4 }, { value: 5, selected: true }, { value: 6 }, { value: 7, selected: true }, { value: 8 }, { value: 9, selected: true }, { value: 10, selected: true }
  ];

  return (
    <div className={cn("w-full max-w-[280px]", className)}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-widest text-primary-900 uppercase">November</span>
          <span className="text-[10px] font-medium text-gray-400">2024</span>
        </div>
        <div className="flex gap-4">
          <button type="button" className="text-gray-400 hover:text-primary-900"><ChevronLeft size={14} /></button>
          <button type="button" className="text-gray-400 hover:text-primary-900"><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-4 text-center">
        {days.map(day => (
          <span key={day} className="text-[8px] font-black text-gray-300 tracking-widest">{day}</span>
        ))}
        {dates.map((date, index) => (
          <div key={index} className="flex justify-center items-center h-8">
            <span className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all",
              date.inactive && "text-gray-200",
              date.selected ? "bg-black text-white" : "text-primary-900 hover:bg-gray-50",
              !date.selected && !date.inactive && "text-primary-900"
            )}>
              {date.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Calendar };
