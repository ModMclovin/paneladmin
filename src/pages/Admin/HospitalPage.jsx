import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../api/fetchApi";

// Hospital Card Component
const HospitalCard = ({ hospital }) => (
  <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
    <h3 className="font-bold text-lg text-gray-800">{hospital.Name}</h3>
    <p className="text-sm text-gray-500">
      {hospital.City}, Ward {hospital.WardNo}, Tole: {hospital.ToleName}
    </p>
    <p className="text-sm text-gray-500">Phone: {hospital.Phone || "-"}</p>
    <p className="text-sm text-gray-500">Email: {hospital.Email || "-"}</p>
    <p className={`text-sm font-semibold ${hospital.IsActive ? "text-green-600" : "text-red-600"}`}>
      {hospital.IsActive ? "Active" : "Inactive"}
    </p>
    <p className="text-xs text-gray-400">Added by: {hospital.AddedBy || "-"}</p>
  </div>
);

const HospitalPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Phone: "",
    Email: "",
    City: "",
    WardNo: "",
    ToleName: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | active
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  // Load hospital list
  const loadHospitals = async () => {
    setLoading(true);
    try {
      const response = await fetchAPI("/getAllHospitalByAdmin");
      const data = response?.data ?? [];
      const mapped = data.map((result) => ({
        TenantId: result.tenantId,
        Name: result.name,
        Email: result.email,
        Phone: result.phone,
        City: result.address?.city?.name ?? result.city ?? "-",
        ToleName: result.address?.toleName ?? result.toleName ?? "-",
        WardNo: result.address?.wardNo ?? result.wardNo ?? "-",
        IsActive: result.isActive,
        AddedBy: result.addedBy,
      }));
      setHospitals(mapped);
    } catch (err) {
      console.error("Error loading hospitals:", err);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  // Load city options
  const loadCities = async () => {
    try {
      const response = await fetchAPI("/getAllCity");
      const data = response?.data ?? [];
      setCityOptions(data);
    } catch (err) {
      console.error("Error loading cities:", err);
      setCityOptions([]);
    }
  };

  useEffect(() => {
    loadHospitals();
    loadCities();
  }, []);

  // Validation
  const validateField = (name, value) => {
    const val = (value ?? "").toString().trim();
    switch (name) {
      case "Name":
        if (!val) return "Hospital Name is required";
        return "";
      case "Phone":
        if (!val) return "Phone is required";
        if (!/^\d{10}$/.test(val)) return "Phone must be 10 digits";
        return "";
      case "Email":
        if (!val) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Invalid email address";
        return "";
      case "City":
        if (!val) return "City is required";
        return "";
      case "WardNo":
        if (!val) return "Ward number is required";
        if (isNaN(Number(val))) return "Ward number must be numeric";
        return "";
      case "ToleName":
        if (!val) return "Tole name is required";
        if (val.length < 5 || val.length > 30) return "Tole name must be 5–30 characters";
        return "";
      default:
        return "";
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Submit Add Hospital
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await fetchAPI("/addHospital", "POST", {
        Name: formData.Name.trim(),
        Phone: formData.Phone.trim(),
        Email: formData.Email.trim(),
        City: formData.City,
        WardNo: Number(formData.WardNo),
        ToleName: formData.ToleName.trim(),
      });
      alert("Hospital added successfully!");
      setShowModal(false);
      setFormData({ Name: "", Phone: "", Email: "", City: "", WardNo: "", ToleName: "" });
      loadHospitals();
    } catch (err) {
      console.error("Error adding hospital:", err);
      setSubmitError("Failed to add hospital");
    }
  };

  // Filtered hospitals
  const filteredHospitals = hospitals
    .filter((h) => activeTab === "active" ? h.IsActive : true)
    .filter((h) =>
      h.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.Email || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((h) => selectedCity ? h.City === selectedCity : true);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hospitals</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Hospital
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setActiveTab("all")}
        >
          All Hospitals
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "active" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setActiveTab("active")}
        >
          Active Hospitals
        </button>
      </div>

      {/* Search and City Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by hospital name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2"
        />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {filteredHospitals.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No hospitals found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <HospitalCard key={hospital.TenantId} hospital={hospital} />
          ))}
        </div>
      )}

      {/* Add Hospital Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Add Hospital</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name, Phone, Email */}
              {["Name", "Phone", "Email"].map((field) => (
                <div key={field} className="space-y-1">
                  <input
                    type={field === "Email" ? "email" : "text"}
                    name={field}
                    placeholder={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
                </div>
              ))}

              {/* City Dropdown */}
              <div className="space-y-1">
                <select
                  name="City"
                  value={formData.City}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.City && <p className="text-red-600 text-sm">{errors.City}</p>}
              </div>

              {/* WardNo & ToleName */}
              {["WardNo", "ToleName"].map((field) => (
                <div key={field} className="space-y-1">
                  <input
                    type={field === "WardNo" ? "number" : "text"}
                    name={field}
                    placeholder={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {errors[field] && <p className="text-red-600 text-sm">{errors[field]}</p>}
                </div>
              ))}

              {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add
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
