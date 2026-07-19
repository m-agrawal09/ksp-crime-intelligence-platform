import React, { useState, useEffect } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { officerService } from "../../services/officerService";
import {
  FaLock,
  FaKey,
  FaShieldAlt,
  FaUserCheck,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUserEdit,
  FaImage,
  FaIdCard
} from "react-icons/fa";

const PRESET_AVATARS = [
  { label: "Male Officer 1", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250&auto=format&fit=crop" },
  { label: "Female Officer 1", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop" },
  { label: "Male Officer 2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop" },
  { label: "Senior DySP", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop" },
  { label: "Tactical Officer", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop" }
];

const Settings = () => {
  const { currentUser, isAdmin, isOfficer, updateUserProfile, updatePassword, updatePin } = useAuth();

  // Admin Security PIN State
  const [newPin, setNewPin] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");
  const [pinError, setPinError] = useState("");

  // Officer Profile & Credentials State
  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    phone: "",
    address: "",
    avatar: "",
    unit: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileError("File size exceeds 5 MB limit.");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setProfileError("Supported formats: PNG, JPG, JPEG.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm((prev) => ({
        ...prev,
        avatar: reader.result
      }));
      setProfileSuccess("Image loaded successfully. Save changes to update profile photo.");
    };
    reader.readAsDataURL(file);
  };

  // Admin Officer Password Reset State
  const [selectedUserId, setSelectedUserId] = useState("");
  const [officerNewPassword, setOfficerNewPassword] = useState("");
  const [officerPwdSuccess, setOfficerPwdSuccess] = useState("");
  const [officerPwdError, setOfficerPwdError] = useState("");

  const usersList = authService.getUsers().filter((u) => u.role === "OFFICER");

  // Sync state with current user session
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || "",
        username: currentUser.username || "",
        phone: currentUser.phone || "+91 98450 12345",
        address: currentUser.address || "Koramangala Police Station Quarters, Bengaluru",
        avatar: currentUser.avatar || PRESET_AVATARS[0].url,
        unit: currentUser.unit || "State Crime Division",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [currentUser]);

  // Handle Admin Security PIN Change
  const handlePinUpdate = (e) => {
    e.preventDefault();
    setPinSuccess("");
    setPinError("");

    const cleanPin = newPin.trim();
    if (cleanPin === authService.getSecurityPin()) {
      setPinError("New Security PIN must be different from the current active PIN.");
      return;
    }

    try {
      const updated = updatePin(cleanPin);
      setPinSuccess(`Manage Records Security PIN successfully updated to '${updated}'!`);
      setNewPin("");
    } catch (err) {
      setPinError(err.message || "Failed to update Security PIN.");
    }
  };

  // Handle Officer Profile & Credentials Update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!currentUser) return;

    const currentPhone = currentUser.phone || "+91 98450 12345";
    const currentAddress = currentUser.address || "Koramangala Police Station Quarters, Bengaluru";
    const currentAvatar = currentUser.avatar || PRESET_AVATARS[0].url;
    const currentUnit = currentUser.unit || "State Crime Division";

    const isNameChanged = profileForm.name.trim() !== (currentUser.name || "").trim();
    const isUsernameChanged = profileForm.username.trim() !== (currentUser.username || "").trim();
    const isPhoneChanged = profileForm.phone.trim() !== currentPhone.trim();
    const isAddressChanged = profileForm.address.trim() !== currentAddress.trim();
    const isAvatarChanged = profileForm.avatar.trim() !== currentAvatar.trim();
    const isUnitChanged = profileForm.unit.trim() !== currentUnit.trim();
    const isPasswordChanged = Boolean(profileForm.newPassword.trim());

    const hasChanges =
      isNameChanged ||
      isUsernameChanged ||
      isPhoneChanged ||
      isAddressChanged ||
      isAvatarChanged ||
      isUnitChanged ||
      isPasswordChanged;

    if (!hasChanges) {
      setProfileError("No changes detected. Modify at least one field before saving.");
      return;
    }

    if (profileForm.newPassword) {
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        setProfileError("Passwords do not match. Please re-enter.");
        return;
      }
      if (profileForm.newPassword.length < 4) {
        setProfileError("Password must be at least 4 characters.");
        return;
      }
    }

    try {
      const updatedUser = updateUserProfile({
        name: profileForm.name,
        username: profileForm.username,
        phone: profileForm.phone,
        address: profileForm.address,
        avatar: profileForm.avatar,
        unit: profileForm.unit,
        password: profileForm.newPassword || undefined
      });

      // Also sync avatar & details to officerService if badge matches
      if (currentUser?.badge || currentUser?.kgid) {
        const badge = currentUser.badge || currentUser.kgid;
        const existingProf = officerService.getOfficerProfile(badge);
        if (existingProf) {
          officerService.addOfficer({
            ...existingProf,
            name: updatedUser.name,
            unit: updatedUser.unit,
            avatar: updatedUser.avatar,
            badgeNumber: badge
          });
        }
      }

      setProfileSuccess("Officer profile and access credentials updated successfully!");
      setProfileForm((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
    } catch (err) {
      setProfileError(err.message || "Failed to update profile.");
    }
  };

  // Handle Admin Password Reset for Officers
  const handleOfficerPasswordReset = (e) => {
    e.preventDefault();
    setOfficerPwdSuccess("");
    setOfficerPwdError("");

    if (!selectedUserId) {
      setOfficerPwdError("Please select an officer account.");
      return;
    }

    if (!officerNewPassword || officerNewPassword.length < 4) {
      setOfficerPwdError("Password must be at least 4 characters long.");
      return;
    }

    try {
      const targetUser = usersList.find((u) => u.id === selectedUserId);
      authService.updatePassword(selectedUserId, officerNewPassword);
      setOfficerPwdSuccess(`Password for officer '${targetUser?.name}' (${targetUser?.username}) updated successfully!`);
      setOfficerNewPassword("");
      setSelectedUserId("");
    } catch (err) {
      setOfficerPwdError(err.message || "Failed to reset officer password.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl font-inter relative pb-16">
      {/* Soft Radial Glow behind the Page Header */}
      <div className="absolute top-0 left-0 right-0 h-[240px] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.06),transparent_70%)] pointer-events-none z-0" />

      {/* Title Header (Space Grotesk) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b border-slate-800/80 pb-6 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-space tracking-tight">
            Command Center Settings & Profile Management
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-inter leading-relaxed max-w-3xl">
            Manage Security PIN, officer profile information, contact details, and account credentials
          </p>
        </div>
        <div className="rounded-[4px] border border-slate-800 bg-[#081220]/90 px-4 py-2.5 text-xs font-mono text-slate-400 flex-shrink-0 self-start">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Visually Unified Parent Console Container */}
      <div className="rounded-lg border border-slate-800/80 bg-[#081220]/50 backdrop-blur-xl shadow-2xl p-8 sm:p-12 space-y-16 relative z-10">
        
        {/* HERO SECTION: Profile Metadata & Drag-Drop Uploader (Side-by-Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* Left Column: Photo Upload (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <FaImage className="text-[#2563eb]" /> PROFILE PHOTO MANAGEMENT
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Officer Photo Preview */}
              <div className="relative h-28 w-28 rounded-lg overflow-hidden border border-slate-700 shadow-xl bg-slate-950 flex-shrink-0">
                <img
                  src={profileForm.avatar || PRESET_AVATARS[0].url}
                  alt="Avatar Preview"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Microsoft Azure Uploader box */}
              <div className="flex-grow w-full">
                <div className="border border-dashed border-slate-700 rounded-[4px] p-5 bg-slate-950/40 text-center hover:border-blue-500 hover:bg-blue-950/5 transition-all relative group cursor-pointer">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="text-xl text-slate-400 group-hover:text-blue-400 transition-colors">📤</span>
                    <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                      Choose Profile Photo
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">
                      PNG • JPG • JPEG (Max 5 MB)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Custom URL Option to preserve original schema fallback */}
            <input
              type="url"
              value={profileForm.avatar}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, avatar: e.target.value }))}
              placeholder="Or enter custom image URL"
              className="w-full h-11 rounded-[4px] bg-slate-950 border border-slate-800 px-3.5 text-xs text-slate-200 outline-none focus:border-blue-500 placeholder-slate-650 transition-all"
            />
          </div>

          {/* Right Column: Profile Hierarchy Metadata (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                OFFICER STATUS SUMMARY
              </label>
              
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-white tracking-wide">{currentUser?.name}</h2>
                <div className="text-sm font-semibold text-blue-400 tracking-wide uppercase font-mono">
                  {currentUser?.rank || "Senior Police Officer"}
                </div>
                <div className="text-xs text-slate-300 font-semibold tracking-wide">
                  Assigned Unit: {currentUser?.unit || "State Crime Division"}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block">KGID NUMBER</span>
                  <span className="text-slate-200 font-bold">{currentUser?.kgid}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px] block">LOGIN USERNAME</span>
                  <span className="text-slate-200 font-bold">{currentUser?.username}</span>
                </div>
              </div>
            </div>

            {/* Security Clearance Status Badge */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-[4px] p-4 flex items-center justify-between">
              <div>
                <span className="block text-slate-500 text-[9px] uppercase font-bold tracking-widest">SECURITY ACCESS STATUS</span>
                <span className="text-[10px] text-slate-400 font-mono">Gateway Protocol Active</span>
              </div>
              <span className="text-emerald-400 font-bold text-xs tracking-wider bg-emerald-950/20 border border-emerald-900/40 px-3.5 py-1.5 rounded-[4px]">
                LEVEL 1 AUTHORIZED
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: Records Security PIN Configuration (Admin Only) */}
        {isAdmin && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
              <FaLock className="text-[#2563eb] text-lg" />
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Records Security PIN Configuration
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Set or change the 4-digit Security PIN required for adding, editing, or deleting FIR records.
                </p>
              </div>
            </div>

            {pinSuccess && (
              <div className="p-3 rounded-[4px] bg-emerald-950/30 border border-emerald-900/50 text-emerald-300 text-xs flex items-center gap-2.5">
                <FaCheckCircle className="text-emerald-400 text-sm" />
                <span>{pinSuccess}</span>
              </div>
            )}

            {pinError && (
              <div className="p-3 rounded-[4px] bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs flex items-center gap-2.5">
                <FaExclamationCircle className="text-rose-400 text-sm" />
                <span>{pinError}</span>
              </div>
            )}

            <form onSubmit={handlePinUpdate} className="flex flex-col sm:flex-row items-end gap-3 max-w-md">
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  New 4-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new PIN (e.g. 4321)"
                  required
                  className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-white outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all placeholder-slate-650"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-6 rounded-[4px] bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all cursor-pointer border-none outline-none"
              >
                <FaSave /> Update PIN
              </button>
            </form>
          </div>
        )}

        {/* SECTION 2: Officer Profile & Contact Details Management */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
            <FaUserEdit className="text-[#2563eb] text-lg" />
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {isOfficer ? "Officer Profile & Station Details" : "Account Profile Details"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Update your photo, contact phone number, quarters address, assigned division unit, and credentials.
              </p>
            </div>
          </div>

          {profileSuccess && (
            <div className="p-3 rounded-[4px] bg-emerald-950/30 border border-emerald-900/50 text-emerald-300 text-xs flex items-center gap-2.5">
              <FaCheckCircle className="text-emerald-400 text-sm" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 rounded-[4px] bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs flex items-center gap-2.5">
              <FaExclamationCircle className="text-rose-400 text-sm" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-8">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Officer Full Name *
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-white outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all placeholder-slate-650"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <FaPhoneAlt className="text-[#2563eb] text-xs" /> Phone Contact Number
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98450 12345"
                  className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-white outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all placeholder-slate-650"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-[#2563eb] text-xs" /> Address / Station Quarters
                </label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Residential Address or Quarters"
                  className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-white outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all placeholder-slate-650"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <FaIdCard className="text-[#2563eb] text-xs" /> Assigned Unit / Station
                </label>
                <input
                  type="text"
                  value={profileForm.unit}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, unit: e.target.value }))}
                  placeholder="Station Unit"
                  className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-white outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all placeholder-slate-650"
                />
              </div>
            </div>

            {/* Credentials Fields Group */}
            <div className="space-y-4 pt-6 border-t border-slate-800/60">
              <h4 className="text-xs font-bold text-[#60a5fa] uppercase tracking-wider flex items-center gap-2">
                <FaKey /> Manage Login Credentials
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Login Username
                  </label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                    required
                    className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-white outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all placeholder-slate-650 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    New Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Leave blank to keep current"
                    className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-white outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all placeholder-slate-650"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Re-enter new password"
                    className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-white outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all placeholder-slate-650"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="h-12 px-6 rounded-[4px] bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/10 transition-all cursor-pointer border-none outline-none"
              >
                <FaSave /> Save Profile & Credentials
              </button>
            </div>

          </form>
        </div>

        {/* SECTION 3: Police Officers Directory & Credential Reset (Admin Only) */}
        {isAdmin && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800/60 pb-3">
              <FaUserCheck className="text-[#2563eb] text-lg" />
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Police Officers Directory & Credential Reset
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  View registered police officer accounts or override an officer's password.
                </p>
              </div>
            </div>

            {officerPwdSuccess && (
              <div className="p-3 rounded-[4px] bg-emerald-950/30 border border-emerald-900/50 text-emerald-300 text-xs flex items-center gap-2.5">
                <FaCheckCircle className="text-emerald-400 text-sm" />
                <span>{officerPwdSuccess}</span>
              </div>
            )}

            {officerPwdError && (
              <div className="p-3 rounded-[4px] bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs flex items-center gap-2.5">
                <FaExclamationCircle className="text-rose-400 text-sm" />
                <span>{officerPwdError}</span>
              </div>
            )}

            {/* Officers Directory Table */}
            <div className="overflow-x-auto rounded-[6px] border border-slate-800 bg-slate-950/40">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                    <th className="py-4 px-5">Officer Name</th>
                    <th className="py-4 px-5">Rank & KGID</th>
                    <th className="py-4 px-5">Login Username</th>
                    <th className="py-4 px-5">Station / Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {usersList.map((off) => (
                    <tr key={off.id} className="hover:bg-blue-950/10 transition-colors duration-150">
                      <td className="py-4.5 px-5 font-semibold text-white flex items-center gap-3">
                        <img src={off.avatar || PRESET_AVATARS[0].url} alt={off.name} className="h-8 w-8 rounded-[4px] object-cover border border-slate-800" />
                        <span>{off.name}</span>
                      </td>
                      <td className="py-4.5 px-5">{off.rank} • {off.kgid}</td>
                      <td className="py-4.5 px-5 font-mono text-[#60a5fa] font-semibold">
                        <code className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-850">
                          {off.username}
                        </code>
                      </td>
                      <td className="py-4.5 px-5 text-slate-400">{off.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Officer Password Override Form */}
            <form onSubmit={handleOfficerPasswordReset} className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Select Officer Account
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-slate-200 outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all cursor-pointer"
                >
                  <option value="">-- Choose Officer --</option>
                  {usersList.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Set Override Password
                </label>
                <input
                  type="text"
                  value={officerNewPassword}
                  onChange={(e) => setOfficerNewPassword(e.target.value)}
                  placeholder="New override password"
                  className="w-full h-12 rounded-[4px] bg-slate-950 border border-slate-800 px-4 text-xs text-white outline-none focus:border-[#2563eb] focus:bg-slate-950 focus:shadow-[0_0_8px_rgba(37,99,235,0.15)] transition-all placeholder-slate-600"
                />
              </div>

              <button
                type="submit"
                className="h-12 rounded-[4px] bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all cursor-pointer border-none outline-none"
              >
                <FaKey /> Override Password
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;
