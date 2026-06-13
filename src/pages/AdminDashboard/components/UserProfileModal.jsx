import React from "react";
import { X, Mail, Phone, Loader2, Calendar, Globe, User } from "lucide-react";
import { useGetUserByIdQuery } from "../../../redux/api/userApiSlice";
import { Button } from "../../../components/ui/Button";

export const UserProfileModal = ({ userId, onClose }) => {
  const { data: response, isLoading, isError } = useGetUserByIdQuery(userId);

  const user = response?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-serif text-primary-900">User Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-primary-900">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Loading User Details...
              </p>
            </div>
          ) : isError || !user ? (
            <div className="text-center py-20 text-gray-500">
              Failed to load user details.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Top Banner & Basic Info */}
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0 bg-gray-100 flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={
                        user.image.startsWith("http")
                          ? user.image
                          : `https://elena-backend-eaoh.onrender.com${user.image}`
                      }
                      alt={user.userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-3xl font-serif text-primary-900">
                        {user.userName || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
                        <Mail size={14} className="text-accent" />
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                        user.status === "blocked"
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {user.status === "blocked" ? "Blocked" : "Active"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <Phone className="text-primary-900" size={18} />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Phone
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {user.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <Globe className="text-primary-900" size={18} />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Country
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {user.country || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <Calendar className="text-primary-900" size={18} />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Joined
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {user.dateOfBirth && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <User className="text-primary-900" size={18} />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Date of Birth
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {user.dateOfBirth}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
