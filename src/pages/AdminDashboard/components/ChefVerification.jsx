import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Eye,
  FileText,
  MapPin,
  ChefHat,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import {
  useGetPendingProfilesQuery,
  useUpdateProfileStatusMutation,
} from "../../../redux/api/profileApiSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { ChefProfileModal } from "./ChefProfileModal";

const ChefVerification = () => {
  const navigate = useNavigate();
  const [selectedChefId, setSelectedChefId] = React.useState(null);
  const { data: apiResponse, isLoading } = useGetPendingProfilesQuery();
  const [updateProfileStatus] = useUpdateProfileStatusMutation();

  const apiProfiles = apiResponse?.data || [];

  const pendingChefs = apiProfiles.map((profile) => ({
    id: profile.userId?._id || profile.userId || profile._id,
    name:
      profile.fullName ||
      profile.displayName ||
      profile.userId?.userName ||
      "Unknown Chef",
    avatar: profile.image
      ? `https://api.tableli.com${profile.image}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || profile.displayName || "Chef")}&background=random`,
    location:
      `${profile.city || ""}, ${profile.country || ""}`
        .trim()
        .replace(/^,|,$/g, "") || "N/A",
    specialty: profile.cuisineSpecialties?.join(" • ") || "N/A",
    experience: profile.yearsOfExperience
      ? `${profile.yearsOfExperience} yrs exp`
      : "N/A",
    documents: [
      profile.cv ? "CV" : null,
      profile.governmentId ? "ID" : null,
      profile.foodSafetyCertificate ? "Certificate" : null,
    ].filter(Boolean),
    appliedDate: new Date(profile.createdAt).toLocaleDateString(),
  }));

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: "Approve Chef?",
      text: "This will approve their profile and allow them to start accepting bookings.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve them!",
    });

    if (result.isConfirmed) {
      try {
        await updateProfileStatus({ id, status: "approved" }).unwrap();
        toast.success("Chef approved successfully");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to approve chef");
      }
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: "Reject Chef?",
      text: "This will reject their application. They will need to contact support or re-apply.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject application",
    });

    if (result.isConfirmed) {
      try {
        await updateProfileStatus({
          id,
          status: "rejected",
          rejectionReason: "Did not meet platform criteria",
        }).unwrap();
        toast.success("Chef rejected");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to reject chef");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary-900" size={40} />
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10 space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-primary-900 mb-2">
          Chef Verification
        </h1>
        <p className="text-gray-500">
          Review and verify applications for the culinary collection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingChefs.map((chef) => (
          <Card
            key={chef.id}
            className="border-none shadow-sm hover:shadow-md transition-all"
          >
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
                    <h3 className="text-xl font-serif text-primary-900 mb-1">
                      {chef.name}
                    </h3>
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
                  <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Documents Submitted
                  </div>
                  <div className="flex flex-wrap md:justify-end gap-2">
                    {chef.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-[10px] font-bold text-gray-600 rounded-md border border-gray-100"
                      >
                        <FileText size={10} />
                        {doc}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    Applied on {chef.appliedDate}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 md:ml-6 pt-6 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedChefId(chef.id)}
                    className="flex-1 md:flex-none h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest group"
                  >
                    <Eye size={16} className="mr-2 group-hover:text-accent" />
                    Review
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleApprove(chef.id)}
                    className="flex-1 md:flex-none h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Check size={16} className="mr-2" />
                    Approve
                  </Button>
                  <button
                    onClick={() => handleReject(chef.id)}
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
        <p className="text-sm text-gray-500">
          There are no more chefs waiting for verification.
        </p>
      </div>

      {selectedChefId && (
        <ChefProfileModal
          userId={selectedChefId}
          onClose={() => setSelectedChefId(null)}
        />
      )}
    </div>
  );
};

export default ChefVerification;

// Helper to keep icons consistent
const Clock = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
