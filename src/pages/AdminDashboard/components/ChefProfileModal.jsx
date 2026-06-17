import React from "react";
import {
  X,
  MapPin,
  Mail,
  Phone,
  Loader2,
  Star,
  ChefHat,
  FileText,
  Globe,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { useGetProfileByUserIdQuery } from "../../../redux/api/profileApiSlice";
import { Button } from "../../../components/ui/Button";

export const ChefProfileModal = ({ userId, onClose }) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetProfileByUserIdQuery(userId, { skip: !userId });

  if (!userId) return null;

  const profile = response?.data;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-serif text-primary-900">
            Chef Profile Review
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary-900" size={40} />
            </div>
          ) : isError || !profile ? (
            <div className="text-center py-20 text-gray-500">
              Failed to load profile details. The chef may not have completed
              their profile yet.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Top Section: Avatar & Basic Info */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <img
                  src={
                    profile.image
                      ? `https://api.tableli.com${profile.image}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || "Chef")}&background=random`
                  }
                  alt={profile.fullName}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-sm"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-3xl font-serif text-primary-900 mb-1">
                      {profile.fullName ||
                        profile.displayName ||
                        profile.userId?.userName}
                    </h3>
                    <p className="text-gray-500 font-medium">
                      Legal Name: {profile.fullLegalName}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-accent" />{" "}
                      {profile.email || profile.userId?.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-accent" />{" "}
                      {profile.phone || profile.userId?.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-accent" />{" "}
                      {profile.city}, {profile.country}
                    </div>
                    <div className="flex items-center gap-2">
                      <ChefHat size={16} className="text-accent" />{" "}
                      {profile.yearsOfExperience} Years Experience
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Links */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                  About the Chef
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {profile.aboutMe || "No bio provided."}
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  {profile.portfolioWebsite && (
                    <a
                      href={profile.portfolioWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-primary-900 hover:text-accent"
                    >
                      <Globe size={16} /> Portfolio
                    </a>
                  )}
                  {profile.instagramProfile && (
                    <a
                      href={`https://instagram.com/${profile.instagramProfile.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-primary-900 hover:text-accent"
                    >
                      <LinkIcon size={16} /> Instagram
                    </a>
                  )}
                </div>
              </div>

              {/* Specialties & Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                      Cuisine Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.cuisineSpecialties?.map((spec, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary-50 text-primary-900 rounded-lg text-xs font-bold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.languages?.map((lang, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                      Business Details
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex justify-between border-b border-gray-100 pb-2">
                        <span>Starting Price</span>{" "}
                        <strong className="text-primary-900">
                          ${profile.startingPricePerPerson}/person
                        </strong>
                      </li>
                      <li className="flex justify-between border-b border-gray-100 pb-2">
                        <span>Minimum Booking</span>{" "}
                        <strong className="text-primary-900">
                          ${profile.minimumBookingAmount}
                        </strong>
                      </li>
                      <li className="flex justify-between border-b border-gray-100 pb-2">
                        <span>Travel Radius</span>{" "}
                        <strong className="text-primary-900">
                          {profile.travelRadius} miles
                        </strong>
                      </li>
                      <li className="flex justify-between border-b border-gray-100 pb-2">
                        <span>Instant Booking</span>{" "}
                        <strong className="text-primary-900">
                          {profile.instantBooking ? "Yes" : "No"}
                        </strong>
                      </li>
                      <li className="flex justify-between border-b border-gray-100 pb-2">
                        <span>Status</span>{" "}
                        <strong className="text-primary-900 capitalize">
                          {profile.status}
                        </strong>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                      Service Windows
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.serviceWindows?.map((window, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-bold"
                        >
                          {window}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                      Chef Category
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.chefCategory?.map((cat, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-900 rounded-lg text-xs font-bold capitalize"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Menu */}
              {(profile.menuDescription ||
                (profile.menuBuilder && profile.menuBuilder.length > 0)) && (
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                    Menu Information
                  </h4>
                  <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm text-sm text-gray-600 whitespace-pre-wrap">
                    {profile.sampleMenuTitle && (
                      <h5 className="font-bold text-primary-900 mb-2">
                        {profile.sampleMenuTitle}
                      </h5>
                    )}
                    {profile.menuDescription && (
                      <p className="mb-4">{profile.menuDescription}</p>
                    )}

                    {profile.menuBuilder && profile.menuBuilder.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <h6 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">
                          Menu Packages
                        </h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {profile.menuBuilder.map((menu) => (
                            <div
                              key={menu._id}
                              className="bg-gray-50 p-3 rounded-xl border border-gray-100"
                            >
                              <p className="font-bold text-primary-900">
                                {menu.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {menu.courses} courses
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Available Dates */}
              {profile.availableDates && profile.availableDates.length > 0 && (
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                    Available Dates
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.availableDates.map((dateStr, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold"
                      >
                        {new Date(dateStr).toLocaleDateString()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Galleries */}
              {(profile.dishPhotography?.length > 0 ||
                profile.eventHighlights?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.dishPhotography?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                        Dish Photography
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {profile.dishPhotography.map((img, idx) => (
                          <img
                            key={idx}
                            src={`https://api.tableli.com${img}`}
                            alt="Dish"
                            className="w-full h-32 object-cover rounded-xl shadow-sm border border-gray-100"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.eventHighlights?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                        Event Highlights
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {profile.eventHighlights.map((img, idx) => (
                          <img
                            key={idx}
                            src={`https://api.tableli.com${img}`}
                            alt="Event"
                            className="w-full h-32 object-cover rounded-xl shadow-sm border border-gray-100"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Uploaded Documents */}
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-3">
                  Verification Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "CV / Resume", url: profile.cv },
                    { label: "Government ID", url: profile.governmentId },
                    {
                      label: "Food Safety Cert.",
                      url: profile.foodSafetyCertificate,
                    },
                  ].map((doc, idx) =>
                    doc.url ? (
                      <a
                        key={idx}
                        href={`https://api.tableli.com${doc.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={20} className="text-gray-400" />
                          <span className="text-sm font-bold text-gray-700">
                            {doc.label}
                          </span>
                        </div>
                        <ExternalLink size={16} className="text-accent" />
                      </a>
                    ) : null,
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
