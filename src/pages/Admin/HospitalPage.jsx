import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../api/fetchApi";
import HospitalGrid from "../../components/Admin/HospitalGrid";

const HospitalPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);

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
      const response = await fetchAPI("/getAllHospitalByAdmin");
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

  /* ------------------ ADD ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetchAPI("/addHospital", "POST", {
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
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="font-bold text-lg mb-4">Add Hospital</h3>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {["Name", "Phone", "Email", "WardNo", "ToleName"].map((f) => (
                <input
                  key={f}
                  type={f === "Email" ? "email" : f === "WardNo" ? "number" : "text"}
                  placeholder={f}
                  value={formData[f]}
                  onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              ))}

              <select
                value={formData.City}
                onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select City</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded"
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
