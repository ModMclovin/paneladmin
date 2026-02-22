import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../api/fetchApi";
import HospitalGrid from "../../components/Admin/HospitalGrid";

const HospitalPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [errors, setErrors] = React.useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Phone: "",
    Email: "",
    City: "",
    WardNo: "",
    ToleName: "",
  });

  /* ------------------ LOAD DATA ------------------ */
  const loadHospitals = async () => {
    setLoading(true);
    try {
      const response = await fetchAPI("/Admin/getAllHospitalByAdmin");
      const data = response?.data ?? [];

      const mapped = data.map((r) => ({
        TenantId: r.tenantId,
        Name: r.name,
        Email: r.email,
        Phone: r.phone,
        City: r.address?.city?.name ?? r.city ?? "-",
        ToleName: r.address?.toleName ?? r.toleName ?? "-",
        WardNo: r.address?.wardNo ?? r.wardNo ?? "-",
        IsActive: r.isActive,
        AddedBy: r.addedBy,
      }));

      setHospitals(mapped);
    } catch {
      setHospitals([]);
    }
    setLoading(false);
  };

  const loadCities = async () => {
    try {
      const response = await fetchAPI("/getAllCity");
      setCityOptions(response?.data ?? []);
    } catch {
      setCityOptions([]);
    }
  };

  useEffect(() => {
    loadHospitals();
    loadCities();
  }, []);

  /* ------------------ FILTER ------------------ */
  const filteredHospitals = hospitals
    .filter((h) => (activeTab === "active" ? h.IsActive : true))
    .filter(
      (h) =>
        h.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.Email || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((h) => (selectedCity ? h.City === selectedCity : true));

  console.log("Filtered Hospitals:", filteredHospitals);

  

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};

  // Name validation
  if (!formData.Name) newErrors.Name = "Name is required";

  // Phone validation
  if (!formData.Phone) newErrors.Phone = "Phone is required";

  // Email validation
  if (!formData.Email) newErrors.Email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formData.Email))
    newErrors.Email = "Email is invalid";

  // WardNo validation
  if (!formData.WardNo) newErrors.WardNo = "Ward number is required";
  else if (Number(formData.WardNo) <= 0)
    newErrors.WardNo = "Ward number must be positive";

  // ToleName validation
  if (!formData.ToleName) newErrors.ToleName = "Tole name is required";

  // City validation
  if (!formData.City) newErrors.City = "City is required";

  setErrors(newErrors);

  // If no errors, proceed
  if (Object.keys(newErrors).length === 0) {
  
    
    await fetchAPI("/Admin/addHospital", "POST", {
      Name: formData.Name.trim(),
      Phone: formData.Phone.trim(),
      Email: formData.Email.trim(),
      City: formData.City,
      WardNo: Number(formData.WardNo),
      ToleName: formData.ToleName.trim(),
    });

    setShowModal(false);
    setFormData({
      Name: "",
      Phone: "",
      Email: "",
      City: "",
      WardNo: "",
      ToleName: "",
    });

    loadHospitals();
  }
  };

  /* ------------------ LOADING ------------------ */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="p-5 space-y-4">

      {/* ------------------ PAGE HEADER ------------------ */}
      {/* <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Hospitals in the System
        </h1>
        <p className="text-sm text-gray-600">
          Total hospitals: {filteredHospitals.length}
        </p>
      </div> */}

      {/* ------------------ FILTER BAR WITH ADD BUTTON ------------------ */}
      <div className="bg-white px-3 py-2 rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-2">

        {/* Left: Tabs + Search + City + Clear */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-2 py-1 text-xs rounded ${
                activeTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setActiveTab("active")}
              className={`px-2 py-1 text-xs rounded ${
                activeTab === "active"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Active
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search hospital..."
            className="h-7 px-2 text-xs border rounded outline-none"
          />

          {/* City Dropdown */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-7 px-2 text-xs border rounded"
          >
            <option value="">All Cities</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Clear Button */}
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCity("");
              setActiveTab("all");
            }}
            className="h-7 px-3 text-xs bg-gray-200 rounded hover:bg-gray-300"
          >
            Clear
          </button>
        </div>

        {/* Right: Add Hospital button */}
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Hospital
          </button>
        </div>
      </div>

      {/* ------------------ GRID ------------------ */}
      {filteredHospitals.length === 0 ? (
        <div className="text-center text-gray-500 py-20">No hospitals found</div>
      ) : (
        <div className="border rounded-lg">
          <HospitalGrid filteredHospitals={filteredHospitals} />
        </div>
      )}

      {/* ------------------ MODAL ------------------ */}
    {/* ------------------ MODAL ------------------ */}
{showModal && (
  <div
    className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
    onClick={() => setShowModal(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#fff", borderRadius: "14px", padding: "20px 24px",
        width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>Add Hospital</div>
        <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>
          Fill in the details to register a new hospital
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

        {/* Field renderer */}
        {[
          { key: "Name",     label: "Hospital Name", type: "text"   },
          { key: "Phone",    label: "Phone Number",  type: "text"   },
          { key: "Email",    label: "Email Address", type: "email"  },
          { key: "WardNo",   label: "Ward Number",   type: "number" },
          { key: "ToleName", label: "Tole Name",     type: "text"   },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <input
              type={type}
              placeholder={label}
              value={formData[key]}
              onChange={(e) => {
                setFormData({ ...formData, [key]: e.target.value });
                if (errors[key]) setErrors({ ...errors, [key]: "" });
              }}
              style={{
                width: "100%", height: "34px",
                padding: "0 10px", fontSize: "12.5px",
                border: `1px solid ${errors[key] ? "#fca5a5" : "#e5e7eb"}`,
                borderRadius: "8px", outline: "none",
                background: errors[key] ? "#fff7f7" : "#fafafa",
                color: "#111827", boxSizing: "border-box",
                fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = errors[key] ? "#ef4444" : "#3b82f6"}
              onBlur={e  => e.target.style.borderColor = errors[key] ? "#fca5a5" : "#e5e7eb"}
            />
            {errors[key] && (
              <div style={{
                fontSize: "10.5px", color: "#ef4444", marginTop: "2px",
                paddingLeft: "2px", fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
              }}>
                {errors[key]}
              </div>
            )}
          </div>
        ))}

        {/* City dropdown */}
        <div>
          <select
            value={formData.City}
            onChange={(e) => {
              setFormData({ ...formData, City: e.target.value });
              if (errors.City) setErrors({ ...errors, City: "" });
            }}
            style={{
              width: "100%", height: "34px",
              padding: "0 10px", fontSize: "12.5px",
              border: `1px solid ${errors.City ? "#fca5a5" : "#e5e7eb"}`,
              borderRadius: "8px", outline: "none",
              background: errors.City ? "#fff7f7" : "#fafafa",
              color: formData.City ? "#111827" : "#9ca3af",
              boxSizing: "border-box",
              fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            }}
          >
            <option value="">Select City</option>
            {cityOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.City && (
            <div style={{
              fontSize: "10.5px", color: "#ef4444", marginTop: "2px",
              paddingLeft: "2px", fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            }}>
              {errors.City}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "6px" }}>
          <button
            type="button"
            onClick={() => { setShowModal(false); setErrors({}); }}
            style={{
              height: "32px", padding: "0 14px", borderRadius: "8px",
              border: "1px solid #e5e7eb", background: "#f9fafb",
              fontSize: "12px", fontWeight: 500, color: "#6b7280",
              cursor: "pointer", fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
            onMouseLeave={e => e.currentTarget.style.background = "#f9fafb"}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              height: "32px", padding: "0 18px", borderRadius: "8px",
              border: "none", background: "#2563eb",
              fontSize: "12px", fontWeight: 600, color: "#fff",
              cursor: "pointer", fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
            onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
          >
            Add Hospital
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default HospitalPage;
