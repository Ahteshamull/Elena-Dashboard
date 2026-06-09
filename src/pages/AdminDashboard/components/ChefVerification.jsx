import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  Eye, 
  FileText, 
  MapPin, 
  ChefHat,
  Star,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import useAdminStore from '../../../store/adminStore';

const ChefVerification = () => {
  const navigate = useNavigate();
  const { pendingChefs, approveChef, rejectChef } = useAdminStore();
  return (
    <div className="py-6 md:py-10 space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">Chef Verification</h1>
        <p className="text-gray-500">Review and verify applications for the culinary collection.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingChefs.map((chef) => (
          <Card key={chef.id} className="border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                {/* Profile Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <img 
                      src={chef.avatar} 
                      alt={chef.name} 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white">
                      <Clock size={12} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-primary-900 mb-1">{chef.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-accent" />
                        {chef.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <ChefHat size={14} className="text-accent" />
                        {chef.specialty}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-accent" />
                        {chef.experience}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents & Date */}
                <div className="flex flex-col gap-2 md:text-right">
                  <div className="text-xs font-black uppercase tracking-widest text-gray-400">Documents Submitted</div>
                  <div className="flex flex-wrap md:justify-end gap-2">
                    {chef.documents.map((doc, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-600 rounded-md border border-gray-100">
                        <FileText size={10} />
                        {doc}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Applied on {chef.appliedDate}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 md:ml-6 pt-6 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/chef-profile')}
                    className="flex-1 md:flex-none h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest group"
                  >
                    <Eye size={16} className="mr-2 group-hover:text-accent" />
                    Review
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => approveChef(chef.id)}
                    className="flex-1 md:flex-none h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check size={16} className="mr-2" />
                    Approve
                  </Button>
                  <button 
                    onClick={() => rejectChef(chef.id)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State Mock */}
      <div className="mt-12 text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
          <ChefHat size={32} />
        </div>
        <h4 className="text-lg font-serif text-gray-900 mb-1">Queue Clear</h4>
        <p className="text-sm text-gray-500">There are no more chefs waiting for verification.</p>
      </div>
    </div>
  );
};

export default ChefVerification;

// Helper to keep icons consistent
const Clock = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
