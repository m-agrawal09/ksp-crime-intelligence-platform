import React, { useState, useEffect } from "react";
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
  FaIdCard,
  FaUpload,
  FaUser
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

  const [usersList, setUsersList] = useState([]);

  // Sync state with current user session and fetch online database officers
  useEffect(() => {
    const sync = async () => {
      await authService.syncOnlineOfficers();
      setUsersList(authService.getUsers().filter((u) => u.role === "OFFICER"));
    };
    sync();

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
    <div className="w-full max-w-5xl font-inter relative pb-16 flex flex-col gap-8">
      {/* Header and Officer Hero Card Group */}
      <div className="flex flex-col gap-5 relative z-10">
        {/* Title Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white font-space tracking-tight leading-tight">
              Settings & Profile Management
            </h1>
            <p className="mt-2 text-sm text-slate-455 font-inter font-normal">
              Manage security PIN, officer profile information, contact details, and account credentials.
            </p>
          </div>
          <div className="rounded-[4px] border border-slate-800 bg-[#081220] px-4 py-2.5 text-xs font-mono text-slate-400 flex-shrink-0 self-start mt-2 md:mt-0 shadow-sm">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* SECTION 1: Officer Hero Card (Structured Flow, Increased Padding and Image Size) */}
        <div className="bg-[#081220] rounded-[4px] border border-[rgba(255,255,255,0.05)] p-10 sm:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-start shadow-sm relative overflow-hidden">
          
          {/* Subtle logo watermark */}
          <div className="absolute right-0 bottom-0 opacity-[0.015] text-[180px] pointer-events-none translate-y-12 translate-x-12 select-none">
            🛡️
          </div>

          {/* Group 1: Photo & Uploader */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 rounded-[4px] overflow-hidden border border-slate-700/50 bg-slate-950 shadow-sm flex-shrink-0">
              <img
                src={profileForm.avatar || PRESET_AVATARS[0].url}
                alt="Officer Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            
            <label htmlFor="avatar-upload-hero" className="cursor-pointer bg-[#0b1220] border border-slate-800 rounded-[4px] px-4 py-2 text-[11px] font-semibold text-white flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm font-inter">
              <FaUpload className="text-[10px]" /> Change Photo
            </label>
            <input
              type="file"
              id="avatar-upload-hero"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Group 2: Identity */}
          <div className="flex flex-col space-y-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-inter">
              Identity
            </span>
            <div className="space-y-2.5">
              <h2 className="text-xl font-bold font-space text-white leading-snug">
                {currentUser?.name || "Commanding Officer"}
              </h2>
              <span className="inline-block text-[9px] font-bold text-[#2563eb] bg-[#2563eb]/10 border border-[#2563eb]/20 px-2.5 py-0.5 rounded-[4px] uppercase tracking-wider font-mono font-space">
                {currentUser?.rank || "Officer Rank"}
              </span>
            </div>
          </div>

          {/* Group 3: Organization */}
          <div className="flex flex-col space-y-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-inter">
              Organization
            </span>
            <div className="space-y-4 text-[13px] text-slate-355 font-inter">
              <div className="flex items-start gap-2.5">
                <FaUser className="text-[18px] text-[#2563eb] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 text-[9px] block font-mono leading-none mb-1">ASSIGNED UNIT</span>
                  <span className="font-semibold text-slate-200">{currentUser?.unit || "N/A"}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <FaIdCard className="text-[18px] text-[#2563eb] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 text-[9px] block font-mono leading-none mb-1">KGID NUMBER</span>
                  <span className="font-semibold font-mono text-slate-200">{currentUser?.kgid || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Group 4: Security Clearance */}
          <div className="flex flex-col space-y-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-inter">
              Security Clearance
            </span>
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#22c55e] font-bold font-mono tracking-wider bg-[#22c55e]/5 border border-[#22c55e]/15 px-2.5 py-1 rounded-[4px]">
                <FaShieldAlt className="text-xs" /> LEVEL 1 AUTHORIZED
              </div>
              <div className="text-[10px] text-slate-555 font-mono">
                <span className="block text-[8px] text-slate-500 uppercase">Granted On</span>
                12 Mar 2024
              </div>
            </div>
          </div>

          {/* Group 5: Status */}
          <div className="flex flex-col space-y-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-inter">
              Status
            </span>
            <div className="space-y-3.5">
              <div>
                <span className="inline-block text-[9px] text-[#2563eb] bg-[#2563eb]/10 border border-[#2563eb]/20 px-2.5 py-0.5 rounded-[4px] font-bold font-mono">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-555 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse flex-shrink-0"></span>
                CatXay Secure
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: Main Settings Area (5-4-3 Grid on Desktop, smooth visual gap-3 between cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 z-10 relative">
        
        {/* Profile & Credentials form spans 9 columns if admin, 12 columns if not */}
        <form 
          onSubmit={handleProfileUpdate} 
          className={`grid grid-cols-1 gap-3 ${isAdmin ? "lg:col-span-9 lg:grid-cols-9" : "lg:col-span-12 lg:grid-cols-12"}`}
        >
          {/* Left Card: Account Profile Details (5 Columns if Admin, 7 if Not) */}
          <div 
            id="profile-details-section"
            className={`flex flex-col justify-between bg-[#081220] rounded-[4px] border border-[rgba(255,255,255,0.05)] p-8 sm:p-10 shadow-sm ${
              isAdmin ? "lg:col-span-5" : "lg:col-span-7"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4 border-b border-slate-800/40 pb-3">
                <FaUserEdit className="text-[18px] text-[#2563eb] flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold font-space text-white tracking-wider">
                    {isOfficer ? "Officer Profile & Station Details" : "Account Profile Details"}
                  </h4>
                  <p className="text-[11px] text-slate-455 mt-0.5 font-light leading-normal">
                    Update profile, contacts, address, and assigned station.
                  </p>
                </div>
              </div>

              {profileSuccess && (
                <div className="p-4 mb-5 rounded-[4px] bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs flex items-center gap-2.5">
                  <FaCheckCircle className="text-[#22c55e] text-sm" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-4 mb-5 rounded-[4px] bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs flex items-center gap-2.5">
                  <FaExclamationCircle className="text-[#ef4444] text-sm" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    Officer Full Name *
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full h-12 rounded-[4px] bg-[#0c182a] border border-slate-800 px-6 text-xs text-white outline-none focus:border-[#2563eb] transition-all font-inter placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    Phone Contact Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full h-12 rounded-[4px] bg-[#0c182a] border border-slate-800 px-6 text-xs text-white outline-none focus:border-[#2563eb] transition-all font-inter placeholder-slate-655"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    Division / Range
                  </label>
                  <input
                    type="text"
                    value="Bengaluru City Police"
                    readOnly
                    className="w-full h-12 rounded-[4px] bg-[#0c182a]/50 border border-slate-800/80 px-6 text-xs text-slate-455 outline-none cursor-not-allowed font-inter"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    Address / Station Quarters
                  </label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full h-12 rounded-[4px] bg-[#0c182a] border border-slate-800 px-6 text-xs text-white outline-none focus:border-[#2563eb] transition-all font-inter placeholder-slate-655"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    District
                  </label>
                  <input
                    type="text"
                    value="Bengaluru Urban"
                    readOnly
                    className="w-full h-12 rounded-[4px] bg-[#0c182a]/50 border border-slate-800/80 px-6 text-xs text-slate-455 outline-none cursor-not-allowed font-inter"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    Assigned Unit / Station
                  </label>
                  <input
                    type="text"
                    value={profileForm.unit}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, unit: e.target.value }))}
                    className="w-full h-12 rounded-[4px] bg-[#0c182a] border border-slate-800 px-6 text-xs text-white outline-none focus:border-[#2563eb] transition-all font-inter placeholder-slate-655"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    Email (Official)
                  </label>
                  <input
                    type="email"
                    value={`${currentUser?.username || "officer"}@ksp.gov.in`}
                    readOnly
                    className="w-full h-12 rounded-[4px] bg-[#0c182a]/50 border border-slate-800/80 px-6 text-xs text-slate-455 outline-none cursor-not-allowed font-inter"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/40">
              <button
                type="submit"
                className="h-12 w-full rounded-[4px] bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-none outline-none font-space"
              >
                <FaSave /> Update Profile
              </button>
            </div>
          </div>

          {/* Center Card: Manage Login Credentials (4 Columns if Admin, 5 if Not) */}
          <div 
            id="login-credentials-section"
            className={`flex flex-col justify-between bg-[#081220] rounded-[4px] border border-[rgba(255,255,255,0.05)] p-8 sm:p-10 shadow-sm ${
              isAdmin ? "lg:col-span-4" : "lg:col-span-5"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4 border-b border-slate-800/40 pb-3">
                <FaKey className="text-[18px] text-[#2563eb] flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold font-space text-white tracking-wider">
                    Manage Login Credentials
                  </h4>
                  <p className="text-[11px] text-slate-450 mt-0.5 font-light leading-normal">
                    Configure login identifier and security passphrase updates.
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    Login Username
                  </label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                    required
                    className="w-full h-12 rounded-[4px] bg-[#0c182a] border border-slate-800 px-6 text-xs text-white outline-none focus:border-[#2563eb] transition-all font-semibold font-inter placeholder-slate-650"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    New Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Leave blank to keep current"
                    className="w-full h-12 rounded-[4px] bg-[#0c182a] border border-slate-800 px-6 text-xs text-white outline-none focus:border-[#2563eb] transition-all font-inter placeholder-slate-655"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Re-enter new password"
                    className="w-full h-12 rounded-[4px] bg-[#0c182a] border border-slate-800 px-6 text-xs text-white outline-none focus:border-[#2563eb] transition-all font-inter placeholder-slate-655"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/40">
              <button
                type="submit"
                className="h-12 w-full rounded-[4px] bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-none outline-none font-space"
              >
                <FaKey /> Update Credentials
              </button>
            </div>
          </div>
        </form>

        {/* Right Card: Records Security PIN Configuration (3 Columns, Admin Only) */}
        {isAdmin && (
          <div 
            id="pin-config-section"
            className="lg:col-span-3 flex flex-col justify-between bg-[#081220] rounded-[4px] border border-[rgba(255,255,255,0.05)] p-8 sm:p-10 shadow-sm"
          >
            <form onSubmit={handlePinUpdate} className="h-full flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-4 border-b border-slate-800/40 pb-3">
                  <FaLock className="text-[18px] text-[#2563eb] flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold font-space text-white tracking-wider">
                      Records Security PIN
                    </h4>
                    <p className="text-[11px] text-slate-455 mt-0.5 font-light leading-normal">
                      PIN required for adding, editing, or deleting FIR records.
                    </p>
                  </div>
                </div>

                {pinSuccess && (
                  <div className="p-4 mb-5 rounded-[4px] bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs flex items-center gap-2.5">
                    <FaCheckCircle className="text-[#22c55e] text-sm" />
                    <span>{pinSuccess}</span>
                  </div>
                )}

                {pinError && (
                  <div className="p-4 mb-5 rounded-[4px] bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs flex items-center gap-2.5">
                    <FaExclamationCircle className="text-[#ef4444] text-sm" />
                    <span>{pinError}</span>
                  </div>
                )}

                {/* PIN Input */}
                <div className="space-y-1.5 mt-4">
                  <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                    Enter new PIN (e.g., 4321)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="••••"
                    required
                    className="w-full h-12 rounded-[4px] bg-[#0c182a] border border-slate-800 px-6 text-xs text-white outline-none focus:border-[#2563eb] transition-all font-mono placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/40">
                <button
                  type="submit"
                  className="h-12 w-full rounded-[4px] bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-none outline-none font-space"
                >
                  <FaLock /> Update PIN
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* SECTION 3: Officer Directory & Password Override (Admin Only, distinct table borders like Wikipedia) */}
      {isAdmin && (
        <div className="bg-[#081220] rounded-[4px] border border-[rgba(255,255,255,0.05)] p-8 sm:p-10 space-y-6 shadow-sm z-10 relative">
          
          {/* Header info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/50 pb-4">
            <div>
              <h3 className="text-base font-semibold font-space text-white uppercase tracking-wider flex items-center gap-2">
                <FaUserCheck className="text-[#2563eb] text-[18px] flex-shrink-0" />
                Police Officers Directory & Credential Reset
              </h3>
              <p className="text-xs text-slate-455 mt-0.5">
                View registered police officer accounts or override an officer's password.
              </p>
            </div>
          </div>

          {officerPwdSuccess && (
            <div className="p-4 mb-5 rounded-[4px] bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs flex items-center gap-2.5">
              <FaCheckCircle className="text-[#22c55e] text-sm" />
              <span>{officerPwdSuccess}</span>
            </div>
          )}

          {officerPwdError && (
            <div className="p-4 mb-5 rounded-[4px] bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs flex items-center gap-2.5">
              <FaExclamationCircle className="text-[#ef4444] text-sm" />
              <span>{officerPwdError}</span>
            </div>
          )}

          {/* Redesigned Premium Wikipedia-Style Fully Bordered Table */}
          <div className="overflow-hidden rounded-[4px] border border-slate-700 shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-inter border-collapse border border-slate-700">
                <thead>
                  <tr className="bg-[#111c30] text-slate-100 font-bold border-b border-slate-700 uppercase text-[10px] tracking-wider font-space">
                    <th className="py-4 px-6 border border-slate-700">Officer Name</th>
                    <th className="py-4 px-6 border border-slate-700">Rank & KGID</th>
                    <th className="py-4 px-6 border border-slate-700">Login Username</th>
                    <th className="py-4 px-6 border border-slate-700">Station / Unit</th>
                  </tr>
                </thead>
                <tbody className="text-slate-355">
                  {usersList.map((off) => (
                    <tr key={off.id} className="odd:bg-[#081220] even:bg-[#0c1626] hover:bg-[#2563eb]/5 transition-colors duration-150">
                      <td className="py-4 px-6 border border-slate-700 font-semibold text-white">
                        <div className="flex items-center gap-4">
                          <img 
                            src={off.avatar || PRESET_AVATARS[0].url} 
                            alt={off.name} 
                            className="h-8 w-8 rounded-[2px] object-cover border border-slate-700/60 shadow-sm" 
                          />
                          <span>{off.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 border border-slate-700 font-medium text-slate-300">{off.rank} • {off.kgid}</td>
                      <td className="py-4 px-6 border border-slate-700 font-mono text-[#60a5fa] font-semibold">
                        <code className="bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
                          {off.username}
                        </code>
                      </td>
                      <td className="py-4 px-6 border border-slate-700 text-slate-400">{off.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Officer Password Override Form */}
          <form onSubmit={handleOfficerPasswordReset} className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                Select Officer Account
              </label>
              <div className="relative">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full h-12 rounded-[4px] bg-[#0b1220] border border-slate-800 px-6 pr-10 text-xs text-slate-200 outline-none focus:border-[#2563eb] transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%2522%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat font-inter"
                >
                  <option value="">-- Choose Officer --</option>
                  {usersList.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} ({off.username})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-slate-400 font-inter tracking-wider">
                Set Override Password
              </label>
              <input
                type="text"
                value={officerNewPassword}
                onChange={(e) => setOfficerNewPassword(e.target.value)}
                placeholder="New override password"
                className="w-full h-12 rounded-[4px] bg-[#0b1220] border border-slate-800 px-6 text-xs text-white outline-none focus:border-[#2563eb] transition-all placeholder-slate-655 font-inter"
              />
            </div>

            <button
              type="submit"
              className="h-12 rounded-[4px] bg-[#2563eb] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border-none outline-none font-space"
            >
              <FaKey /> Override Password
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Settings;
