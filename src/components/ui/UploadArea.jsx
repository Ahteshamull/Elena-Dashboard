import React from 'react';
import { CloudUpload } from 'lucide-react';
import { cn } from '../../utils/cn';

const UploadArea = ({ className, title, subtitle, icon: Icon = CloudUpload, ...props }) => {
  return (
    <div className={cn(
      "relative w-full border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-accent hover:bg-[#FAFAFA] transition-all group",
      className
    )} {...props}>
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-accent group-hover:bg-accent/10 transition-colors">
        <Icon size={24} />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-primary-900 mb-1">{title}</p>
        <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[200px] mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export { UploadArea };
