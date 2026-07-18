import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaFolderPlus, FaUser, FaMapMarkerAlt, FaShieldAlt, FaFileAlt } from "react-icons/fa";

const FIRFormModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const isEdit = Boolean(initialData && initialData.id);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    crimeNo: "",
    caseNo: "",
    regDate: new Date().toISOString().split("T")[0],
    incidentFromDate: new Date().toISOString().slice(0, 16),
    incidentToDate: "",
    district: "Bengaluru City",
    unit: "Koramangala Police Station",
    crimeHead: "Property Offences",
    crimeSubHead: "Theft",
    actSections: "IPC Sec 379 / BNS Sec 303",
    cognizableType: "Cognizable",
    severity: "MEDIUM",
    status: "Under Investigation",
    
    complainantName: "",
    complainantPhone: "",
    complainantAddress: "",
    complainantIdType: "Aadhaar",
    complainantIdNo: "",
    
    locationStreet: "",
    landmark: "",
    lat: "12.9352",
    lng: "77.6245",
    
    allottedOfficerName: "Ramesh Gowda",
    allottedOfficerRank: "PSI",
    allottedOfficerKgid: "KSP-8821",
    
    accusedName: "Unknown",
    accusedStatus: "Unidentified",
    
    briefFacts: "",
    propertyDescription: "",
    estimatedValue: "0",
    resolutionNotes: "",
    officialReportImage: ""
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, officialReportImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        officialReportImage: initialData.officialReportImage || "",
        lat: String(initialData.lat || 12.9352),
        lng: String(initialData.lng || 77.6245),
        estimatedValue: String(initialData.estimatedValue || 0)
      });
    } else {
      setFormData({
        crimeNo: "",
        caseNo: "",
        regDate: new Date().toISOString().split("T")[0],
        incidentFromDate: new Date().toISOString().slice(0, 16),
        incidentToDate: "",
        district: "Bengaluru City",
        unit: "Koramangala Police Station",
        crimeHead: "Property Offences",
        crimeSubHead: "Theft",
        actSections: "IPC Sec 379 / BNS Sec 303",
        cognizableType: "Cognizable",
        severity: "MEDIUM",
        status: "Under Investigation",
        complainantName: "",
        complainantPhone: "",
        complainantAddress: "",
        complainantIdType: "Aadhaar",
        complainantIdNo: "",
        locationStreet: "",
        landmark: "",
        lat: "12.9352",
        lng: "77.6245",
        allottedOfficerName: "Ramesh Gowda",
        allottedOfficerRank: "PSI",
        allottedOfficerKgid: "KSP-8821",
        accusedName: "Unknown",
        accusedStatus: "Unidentified",
        briefFacts: "",
        propertyDescription: "",
        estimatedValue: "0",
        resolutionNotes: ""
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden my-8 font-sans">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FaFolderPlus className="text-base" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-white tracking-wider uppercase">
                {isEdit ? `Edit CCTNS Record: ${formData.crimeNo || formData.id}` : "Register New CCTNS FIR Record"}
              </h2>
              <p className="text-xs text-slate-400">
                Core Application Software (CAS) IIF-1 First Information Logging Form
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 transition-colors rounded-lg hover:bg-slate-800"
          >
            <FaTimes className="text-base" />
          </button>
        </div>

        {/* Modal Form Sub-tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-900/40 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-bold uppercase transition-all ${
              activeTab === "general"
                ? "border-blue-500 text-blue-400 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FaShieldAlt /> 1. FIR & Classification
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("complainant")}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-bold uppercase transition-all ${
              activeTab === "complainant"
                ? "border-blue-500 text-blue-400 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FaUser /> 2. Complainant & Location
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("officer")}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-bold uppercase transition-all ${
              activeTab === "officer"
                ? "border-blue-500 text-blue-400 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FaMapMarkerAlt /> 3. Allotted Officer & Accused
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("brief")}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-bold uppercase transition-all ${
              activeTab === "brief"
                ? "border-blue-500 text-blue-400 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FaFileAlt /> 4. Brief Facts & Seizure
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: General & Classification */}
          {activeTab === "general" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Crime Number (18-Digit CCTNS)</label>
                <input
                  type="text"
                  name="crimeNo"
                  value={formData.crimeNo}
                  onChange={handleChange}
                  placeholder="Auto-generated if empty"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Registration Date</label>
                <input
                  type="date"
                  name="regDate"
                  value={formData.regDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Incident From Date & Time</label>
                <input
                  type="datetime-local"
                  name="incidentFromDate"
                  value={formData.incidentFromDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">District Name</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                >
                  <option value="Bengaluru City">Bengaluru City</option>
                  <option value="Mangaluru City">Mangaluru City</option>
                  <option value="Mysuru City">Mysuru City</option>
                  <option value="Hubballi-Dharwad">Hubballi-Dharwad</option>
                  <option value="Belagavi District">Belagavi District</option>
                  <option value="Kalaburagi Range">Kalaburagi Range</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Police Station Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g. Koramangala Police Station"
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Major Crime Head / Category</label>
                <select
                  name="crimeHead"
                  value={formData.crimeHead}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                >
                  <option value="Property Offences">Property Offences</option>
                  <option value="Offences Against Body">Offences Against Body</option>
                  <option value="Cyber Crimes">Cyber Crimes</option>
                  <option value="Financial Fraud">Financial Fraud</option>
                  <option value="Special & Local Laws (SLL)">Special & Local Laws (SLL)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Crime Sub-Head / MO</label>
                <input
                  type="text"
                  name="crimeSubHead"
                  value={formData.crimeSubHead}
                  onChange={handleChange}
                  placeholder="e.g. Dacoity, Cyber Fraud, Theft"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">IPC / BNS Act & Sections</label>
                <input
                  type="text"
                  name="actSections"
                  value={formData.actSections}
                  onChange={handleChange}
                  placeholder="e.g. IPC Sec 379 / BNS Sec 303"
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Severity / Risk Level</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono font-bold"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Initial Investigation Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                >
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Suspect Apprehended">Suspect Apprehended</option>
                  <option value="Charge-sheet Submitted">Charge-sheet Submitted</option>
                  <option value="Case Closed / Completed">Case Closed / Completed</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: Complainant & Location */}
          {activeTab === "complainant" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Complainant Full Name</label>
                <input
                  type="text"
                  name="complainantName"
                  value={formData.complainantName}
                  onChange={handleChange}
                  placeholder="e.g. Siddharth Malhotra"
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Complainant Phone Number</label>
                <input
                  type="text"
                  name="complainantPhone"
                  value={formData.complainantPhone}
                  onChange={handleChange}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 font-mono mb-1">Complainant Permanent Address</label>
                <input
                  type="text"
                  name="complainantAddress"
                  value={formData.complainantAddress}
                  onChange={handleChange}
                  placeholder="House No, Street, Landmark, District"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">ID Proof Type</label>
                <select
                  name="complainantIdType"
                  value={formData.complainantIdType}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                >
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="PAN Card">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">ID Proof Document Number</label>
                <input
                  type="text"
                  name="complainantIdNo"
                  value={formData.complainantIdNo}
                  onChange={handleChange}
                  placeholder="e.g. XXXX-XXXX-8812"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="md:col-span-2 border-t border-slate-900 pt-4 mt-2">
                <h3 className="font-mono font-bold text-blue-400 uppercase text-xs mb-3">Incident Location & GIS Coordinates</h3>
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 font-mono mb-1">Incident Street / Site Address</label>
                <input
                  type="text"
                  name="locationStreet"
                  value={formData.locationStreet}
                  onChange={handleChange}
                  placeholder="e.g. 100 Feet Road Commercial Warehouse"
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">GIS Latitude (Lat)</label>
                <input
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="12.9352"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">GIS Longitude (Lng)</label>
                <input
                  type="text"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="77.6245"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Allotted Officer & Accused */}
          {activeTab === "officer" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="md:col-span-2">
                <h3 className="font-mono font-bold text-purple-400 uppercase text-xs mb-1">Investigating Officer Allocation</h3>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Investigating Officer (IO) Name</label>
                <input
                  type="text"
                  name="allottedOfficerName"
                  value={formData.allottedOfficerName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Gowda"
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Officer Rank</label>
                <select
                  name="allottedOfficerRank"
                  value={formData.allottedOfficerRank}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                >
                  <option value="PSI">PSI (Police Sub-Inspector)</option>
                  <option value="CPI">CPI (Circle Police Inspector)</option>
                  <option value="ASI">ASI (Assistant Sub-Inspector)</option>
                  <option value="Inspector">Inspector</option>
                  <option value="ACP">ACP (Assistant Commissioner)</option>
                  <option value="DySP">DySP (Deputy Superintendent)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Officer KGID Badge Number</label>
                <input
                  type="text"
                  name="allottedOfficerKgid"
                  value={formData.allottedOfficerKgid}
                  onChange={handleChange}
                  placeholder="e.g. KSP-8821"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="md:col-span-2 border-t border-slate-900 pt-4 mt-2">
                <h3 className="font-mono font-bold text-amber-400 uppercase text-xs mb-1">Accused / Suspect Details</h3>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Primary Accused / Suspect Name</label>
                <input
                  type="text"
                  name="accusedName"
                  value={formData.accusedName}
                  onChange={handleChange}
                  placeholder="e.g. Kiran Kumar (or 'Unknown')"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Apprehension / Custody Status</label>
                <select
                  name="accusedStatus"
                  value={formData.accusedStatus}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                >
                  <option value="Absconding">Absconding</option>
                  <option value="Detained">Detained</option>
                  <option value="Judicial Custody">Judicial Custody</option>
                  <option value="On Bail">On Bail</option>
                  <option value="Unidentified">Unidentified</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 4: Brief Facts & Seizure */}
          {activeTab === "brief" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Brief Facts of the Case (Narrative)</label>
                <textarea
                  name="briefFacts"
                  value={formData.briefFacts}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Detailed chronological facts of the incident as reported in FIR..."
                  required
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-3 text-slate-200 outline-none focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Stolen / Seized Property Description</label>
                <input
                  type="text"
                  name="propertyDescription"
                  value={formData.propertyDescription}
                  onChange={handleChange}
                  placeholder="e.g. Electronic equipment, vehicles, cash..."
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Estimated Property Value (in INR ₹)</label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-slate-200 outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Resolution / Disposal Notes (If Case Closed)</label>
                <textarea
                  name="resolutionNotes"
                  value={formData.resolutionNotes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Final report details or disposal notes..."
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-3 text-slate-200 outline-none focus:border-blue-500 font-sans"
                />
              </div>

              {/* 5. Written Official Report Picture / Scanned Copy Upload */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <label className="block text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <FaFileAlt /> Official Written Report Scanned Document / Photo
                </label>
                <p className="text-[11px] text-slate-400 font-mono">
                  Upload a scanned photo or image copy of the written official report filed for this FIR.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono text-slate-300">Choose Image File from Computer:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs font-mono text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-mono file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                    />

                  </div>

                  {/* Document Preview Box */}
                  <div className="flex flex-col items-center justify-center border border-slate-800 rounded-lg p-2 bg-slate-950 min-h-[120px]">
                    {formData.officialReportImage ? (
                      <div className="relative w-full text-center space-y-1">
                        <img
                          src={formData.officialReportImage}
                          alt="Official Report Preview"
                          className="h-28 w-full object-cover rounded-md border border-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, officialReportImage: "" }))}
                          className="text-[10px] font-mono text-rose-400 hover:underline"
                        >
                          Remove Attached Report Photo
                        </button>
                      </div>
                    ) : (
                      <div className="text-center font-mono text-[10px] text-slate-500 space-y-1 p-4">
                        <FaFileAlt className="text-xl text-slate-600 mx-auto" />
                        <span>No official report document attached yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[10px] font-mono text-slate-500">
              * Required fields: Registration Date, Station Unit, Act & Sections, Complainant Name, Location, Brief Facts
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-mono transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
              >
                <FaSave /> {isEdit ? "Save Changes" : "Create CCTNS FIR Record"}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default FIRFormModal;
