import React from "react";
import {
  X,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  CreditCard,
  User,
  ChefHat,
} from "lucide-react";
import { useGetBookingByIdQuery } from "../../../redux/api/bookingApiSlice";
import { Button } from "../../../components/ui/Button";

export const BookingDetailsModal = ({ bookingId, onClose }) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetBookingByIdQuery(bookingId);

  const booking = response?.data;
  const details = booking?.bookingDetails;
  const chef = booking?.chefInfo;
  const client = booking?.clientInfo;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-600";
      case "confirmed":
        return "bg-blue-50 text-blue-600";
      case "pending":
        return "bg-amber-50 text-amber-600";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-serif text-primary-900">
            Booking Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-primary-900">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Loading Booking Details...
              </p>
            </div>
          ) : isError || !booking || !details ? (
            <div className="text-center py-20 text-gray-500">
              Failed to load booking details.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                    Booking ID
                  </p>
                  <p className="text-sm font-mono font-bold text-primary-900">
                    {details._id}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(details.status)}`}
                  >
                    {details.status}
                  </span>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${details.paymentStatus === "SUCCESS" ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-600"}`}
                  >
                    Payment: {details.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <Calendar size={16} /> Event Details
                  </h3>
                  <div className="space-y-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between border-b border-gray-50 pb-3">
                      <span className="text-sm text-gray-500">Date</span>
                      <span className="text-sm font-bold text-primary-900">
                        {new Date(details.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-3">
                      <span className="text-sm text-gray-500">
                        Arrival Time
                      </span>
                      <span className="text-sm font-bold text-primary-900">
                        {details.arrivalTime}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-3">
                      <span className="text-sm text-gray-500">Guests</span>
                      <span className="text-sm font-bold text-primary-900 flex items-center gap-1">
                        <Users size={14} /> {details.numberOfGuests}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block mb-1">
                        Location
                      </span>
                      <span className="text-sm font-bold text-primary-900 flex items-start gap-2">
                        <MapPin
                          size={16}
                          className="text-accent shrink-0 mt-0.5"
                        />
                        {details.eventLocation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financials & Contact */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <DollarSign size={16} /> Financials
                    </h3>
                    <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm bg-emerald-50/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 font-bold">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                          ${details.totalAmount}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        Txn: {details.paymentId}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <User size={16} /> Client Contact
                    </h3>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                      <p className="font-bold text-primary-900">
                        {details.firstName} {details.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{details.email}</p>
                      <p className="text-sm text-gray-500">{details.phone}</p>
                      {client && (
                        <div className="mt-3 pt-3 border-t border-gray-50">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                            Platform Account
                          </p>
                          <p className="text-xs text-gray-600">
                            Username: {client.userName}
                          </p>
                          <p className="text-xs text-gray-600">
                            Joined:{" "}
                            {new Date(client.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chef Details */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <ChefHat size={16} /> Assigned Chef
                  </h3>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shrink-0 bg-gray-50">
                      {chef?.profile?.image ? (
                        <img
                          src={
                            chef.profile.image.startsWith("http")
                              ? chef.profile.image
                              : `${import.meta.env.VITE_BASE_URL}${chef.profile.image}`
                          }
                          alt={chef.profile.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ChefHat size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-lg text-primary-900">
                            {chef?.profile?.fullName ||
                              chef?.userName ||
                              "Unknown Chef"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {chef?.profile?.city}, {chef?.profile?.country}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-500">
                            Bookings Completed:{" "}
                            <span className="font-bold text-primary-900">
                              {chef?.totalBookingsCompleted}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Experience:{" "}
                            <span className="font-bold text-primary-900">
                              {chef?.profile?.yearsOfExperience || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>

                      {chef?.profile?.cuisineSpecialties?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                            Specialties
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {chef.profile.cuisineSpecialties
                              .slice(0, 5)
                              .map((spec) => (
                                <span
                                  key={spec}
                                  className="px-2 py-1 bg-gray-50 rounded-lg text-xs text-gray-600 font-medium"
                                >
                                  {spec}
                                </span>
                              ))}
                            {chef.profile.cuisineSpecialties.length > 5 && (
                              <span className="px-2 py-1 bg-gray-50 rounded-lg text-xs text-gray-600 font-medium">
                                +{chef.profile.cuisineSpecialties.length - 5}{" "}
                                more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {chef?.profile?.menuBuilder?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-50">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                            Requested Menu (
                            {chef.profile.menuBuilder[0].courses} Courses)
                          </p>
                          <p className="text-sm font-medium text-primary-900">
                            {chef.profile.menuBuilder[0].title}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="md:col-span-2 text-center mt-4">
                  <p className="text-xs text-gray-400">
                    Booking Created:{" "}
                    {new Date(details.createdAt).toLocaleString()} | Last
                    Updated: {new Date(details.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
