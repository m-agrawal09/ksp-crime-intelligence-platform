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
    <div className="space-y-6 md:space-y-8 max-w-5xl">
      {/* Title Header */}
      <PageHeader
        title="Command Center Settings & Profile Management"
        subtitle="Manage Security PIN, officer profile information, contact details, and account credentials"
      />

      {/* User Session Profile Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-700 shadow-md bg-slate-950 flex-shrink-0">
            <img
              src={currentUser?.avatar || PRESET_AVATARS[0].url}
              alt={currentUser?.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-mono">{currentUser?.name}</h2>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                isAdmin ? "bg-blue-600 text-white" : "bg-purple-600 text-white"
              }`}>
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Username: <code className="text-slate-200 font-bold">{currentUser?.username}</code> • KGID: {currentUser?.kgid} • {currentUser?.unit}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 text-right">
          <span className="block text-slate-500 text-[10px] uppercase">SECURITY CLEARANCE</span>
          <span className="text-emerald-400 font-bold">LEVEL 1 AUTHORIZED</span>
        </div>
      </div>

      {/* ADMIN ONLY SECTION: Security PIN Management */}
      {isAdmin && (
        <div className="rounded-xl border border-blue-900/50 bg-slate-900/80 p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FaLock className="text-blue-400 text-lg" />
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Manage Records Security PIN Configuration (Admin Right)
                </h3>
                <p className="text-xs text-slate-400">
                  Set or change the 4-digit Security PIN required for adding, editing, or deleting FIR records.
                </p>
              </div>
            </div>
            <div className="font-mono text-xs text-slate-400">
              Current PIN: <code className="text-blue-400 font-bold text-sm bg-slate-950 px-2 py-1 rounded border border-slate-800">{authService.getSecurityPin()}</code>
            </div>
          </div>

          {pinSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <FaCheckCircle className="text-emerald-400 text-sm" />
              <span>{pinSuccess}</span>
            </div>
          )}

          {pinError && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
              <FaExclamationCircle className="text-rose-400 text-sm" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handlePinUpdate} className="flex flex-col sm:flex-row items-end gap-3 max-w-lg">
            <div className="flex-1 w-full">
              <label className="block text-xs font-mono text-slate-400 mb-1">Set New 4-Digit Security PIN</label>
              <input
                type="password"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new PIN (e.g. 4321)"
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <FaSave /> Update PIN
            </button>
          </form>
        </div>
      )}

      {/* OFFICER & ADMIN PROFILE MANAGEMENT SECTION */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FaUserEdit className="text-purple-400" />
              {isOfficer ? "Officer Profile & Contact Details Management" : "My Account & Profile Details"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your photo, contact phone number, residential address, division unit, and login credentials.
            </p>
          </div>
        </div>

        {profileSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <FaCheckCircle className="text-emerald-400 text-sm" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
            <FaExclamationCircle className="text-rose-400 text-sm" />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          
          {/* Section A: Photo / Avatar Selection */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FaImage className="text-purple-400" /> Profile Photo / Avatar
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden border border-purple-500/40 shadow-lg flex-shrink-0 bg-slate-900">
                <img
                  src={profileForm.avatar}
                  alt="Avatar Preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileForm((prev) => ({ ...prev, avatar: av.url }))}
                      className={`p-1.5 rounded-lg border text-[10px] font-mono flex flex-col items-center gap-1 transition-all ${
                        profileForm.avatar === av.url
                          ? "border-purple-500 bg-purple-950/30 text-purple-300 font-bold"
                          : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="h-8 w-8 rounded-md object-cover" />
                      <span className="truncate w-full text-center">{av.label}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <input
                    type="url"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, avatar: e.target.value }))}
                    placeholder="Or enter custom image URL"
                    className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Personal Information & Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1 font-bold">Officer Full Name *</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold flex items-center gap-1.5">
                <FaPhoneAlt className="text-emerald-400 text-xs" /> Phone Contact Number
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98450 12345"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-amber-400 text-xs" /> Address / Station Quarters
              </label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Residential Address or Quarters"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-bold flex items-center gap-1.5">
                <FaIdCard className="text-purple-400 text-xs" /> Assigned Unit / Station
              </label>
              <input
                type="text"
                value={profileForm.unit}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, unit: e.target.value }))}
                placeholder="Station Unit"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Section C: Credentials Update */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <h4 className="font-mono font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-2">
              <FaKey /> Manage Login Credentials
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Login Username</label>
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, username: e.target.value }))}
                  required
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-white outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">New Password (Optional)</label>
                <input
                  type="password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Leave blank to keep current"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={profileForm.confirmPassword}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
            >
              <FaSave /> Save Profile & Credentials
            </button>
          </div>

        </form>
      </div>

      {/* ADMIN ONLY SECTION: Officer Accounts Directory & Password Reset */}
      {isAdmin && (
        <div className="rounded-xl border border-purple-900/50 bg-slate-900/80 p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FaUserCheck className="text-purple-400 text-lg" />
              <div>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Police Officers Directory & Credential Reset (Admin Right)
                </h3>
                <p className="text-xs text-slate-400">
                  View registered police officer accounts or override an officer's password.
                </p>
              </div>
            </div>
          </div>

          {officerPwdSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <FaCheckCircle className="text-emerald-400 text-sm" />
              <span>{officerPwdSuccess}</span>
            </div>
          )}

          {officerPwdError && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
              <FaExclamationCircle className="text-rose-400 text-sm" />
              <span>{officerPwdError}</span>
            </div>
          )}

          {/* Officers Directory Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                  <th className="p-3">Officer Name</th>
                  <th className="p-3">Rank & KGID</th>
                  <th className="p-3">Login Username</th>
                  <th className="p-3">Station / Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {usersList.map((off) => (
                  <tr key={off.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <img src={off.avatar || PRESET_AVATARS[0].url} alt={off.name} className="h-6 w-6 rounded-md object-cover" />
                      <span>{off.name}</span>
                    </td>
                    <td className="p-3">{off.rank} • {off.kgid}</td>
                    <td className="p-3 text-purple-400 font-bold"><code className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{off.username}</code></td>
                    <td className="p-3 text-slate-400">{off.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Officer Password Reset Form */}
          <form onSubmit={handleOfficerPasswordReset} className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Select Officer Account</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-purple-500"
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
              <label className="block text-xs font-mono text-slate-400 mb-1">Set Override Password</label>
              <input
                type="text"
                value={officerNewPassword}
                onChange={(e) => setOfficerNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
            >
              <FaKey /> Override Officer Password
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Settings;
