import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Edit2,
  Trash2,
  Menu,
  X,
  Home,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function HospitalAdminDashboard({ onLogout }) {
   const NGROK_API_URL = "https://localhost:7252/getAllDoctorSchedules";
  const TENANT_ID = "2bbba50d-3607-4ef9-8180-ba4408c4f3d0";

  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("schedules");
  // const [doctors, setDoctors] = useState([
  //   {
  //     id: 1,
  //     name: "Dr. Samarat",
  //     specialty: "Cardiology",
  //     email: "samrat@gmail.com",
  //     available: true,
  //     schedule: { date: "2025-12-25", startTime: "09:00", endTime: "17:00" },
  //   },
  //   {
  //     id: 2,
  //     name: "Dr. Rabina",
  //     specialty: "Pediatrics",
  //     email: "rabina@gmail.com",
  //     available: false,
  //     schedule: { date: "2025-12-25", startTime: "10:00", endTime: "14:00" },
  //   },
  //   {
  //     id: 3,
  //     name: "Dr. Sita",
  //     specialty: "Orthopedics",
  //     email: "sita@gmail.com",
  //     available: true,
  //     schedule: { date: "2025-12-25", startTime: "08:00", endTime: "16:00" },
  //   },
  // ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorEmail: "",
    doctorPhoneNumber: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      debugger;
      try {
        const response = await axios.get(NGROK_API_URL, {
          headers: {
            "X-Tenant-Id": TENANT_ID,
            accept: "*/*",
          },
        });

        if (response.status === 200 && response.data.isSuccess) {
          const mappedDoctors = response.data.data.map((doc) => ({
            id: doc.id || doc.doctorName, // fallback if no unique id
            name: doc.doctorName,
            specialty: doc.specialization,
            email: doc.email, // assuming doctorName is email
            available:
              doc.schedules?.some(
                (s) => s.isDoctorAvailable && s.isEffective
              ) ?? false,
            schedule: doc.schedules?.[0] // you can map more if needed
              ? {
                  date: doc.schedules[0].scheduleDate,
                  startTime: doc.schedules[0].startTime,
                  endTime: doc.schedules[0].endTime,
                }
              : null,
            departments: doc.departments || [],
          }));
          setDoctors(mappedDoctors);
        } else {
          console.error("Unexpected status code:", response.status);
          setError(
            `Failed to fetch doctor schedules. Status code: ${response.status}`
          );
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to fetch doctor schedules");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setFormData({
      doctorEmail: "",
      doctorPhoneNumber: "",
      date: "",
      startTime: "",
      endTime: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (doctor) => {
    setFormData({
      doctorEmail: doctor.email,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: doctor.schedule.date,
      startTime: doctor.schedule.startTime,
      endTime: doctor.schedule.endTime,
    });
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    debugger;
    console.log("Handle Save Clicked");
    if (
      !formData.doctorEmail ||
      !formData.doctorPhoneNumber ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      setErrorMessage("Please fill in all fields");
      return;
    }
const payload = {
    doctorEmail: formData.doctorEmail,
    doctorPhoneNumber: formData.doctorPhoneNumber,
    doctorSchedule: {
      scheduleDate: new Date(formData.date).toISOString(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      isDoctorAvailable: true
    }
  };
try {
  debugger;
    const response = await fetch(
      "https://localhost:7252/addDoctorSchedule",
      {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
          "X-Tenant-Id": "2bbba50d-3607-4ef9-8180-ba4408c4f3d0"
        },
        body: JSON.stringify(payload)
      }
    );

      if (response.status != 200) {
        const errorData = await response.json();
        setErrorMessage(
          `Error: ${response.data.message || "Failed to add schedule"}`
        );
        return;
      }
      const data = await response.json();

    setSuccessMessage(`${data.message || 'Schedule added successfully!'}`);
    setShowForm(false);
  } catch (error) {
    setErrorMessage("Something went wrong. Please try again.");
    console.error("Fetch error:", error);
  }


    setLoading(true);

  };

  const handleDelete = (id) => {
    setDoctors(doctors.filter((doc) => doc.id !== id));
  };

  const toggleAvailability = (id) => {
    setDoctors(
      doctors.map((doc) =>
        doc.id === id ? { ...doc, available: !doc.available } : doc
      )
    );
  };

  const menuItems = [
    { id: "schedules", icon: Calendar, label: "Doctor Schedules" },
    { id: "doctor", icon: Home, label: "Doctor" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                JeevanCare
              </h2>
              <p className="text-xs text-gray-500">Hospital Admin</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64">
        {/* Top Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
            <h1 className="text-lg font-semibold text-gray-800 flex-1 lg:flex-none">
              Doctor Schedule Management
            </h1>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Logout"
            >
              <User size={20} className="text-gray-600" />
            </button>
          </div>
        </nav>

        {/* Main Content Old Part */}
        <main className="pb-8 px-6 pt-6">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Doctor Schedule Management
            </h2>
            <p className="text-gray-600">
              Manage doctor availability and assign schedules
            </p>
          </div>

          {/* Search & Add Button */}
          <div className="flex gap-4 mb-6 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by doctor name, email or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handleAddClick}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all font-medium"
            >
              <Plus size={18} />
              Add Doctor Schedule
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {editingId
                    ? "Edit Doctor Schedule"
                    : "Add New Doctor Schedule"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor Email *
                    </label>
                    <input
                      type="email"
                      value={formData.doctorEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          doctorEmail: e.target.value,
                        })
                      }
                      placeholder="e.g., doctor@hospital.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PhoneNumber*
                    </label>
                    <input
                      type="text"
                      value={formData.doctorPhoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          doctorPhoneNumber: e.target.value,
                        })
                      }
                      placeholder="e.g., 9876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty *
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                    placeholder="e.g., Cardiology"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startTime: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time *
                      </label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {errorMessage && (
                    <div className="text-red-500 font-medium">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="text-green-500 font-medium">
                      {successMessage}
                    </div>
                  )}

                  <button
                    onClick={() => setShowForm(false)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all font-medium disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Cards */}
          <div className="space-y-4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {doctor.specialty}
                        </p>
                        <p className="text-sm text-gray-500 mb-2 break-all">
                          {doctor.email}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1 text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                            <Calendar
                              size={14}
                              className="text-blue-500 flex-shrink-0"
                            />
                            {doctor.schedule.date}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                            <Clock
                              size={14}
                              className="text-blue-500 flex-shrink-0"
                            />
                            {doctor.schedule.startTime} -{" "}
                            {doctor.schedule.endTime}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => toggleAvailability(doctor.id)}
                        className={`p-2 rounded-lg transition-all ${
                          doctor.available
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={doctor.available ? "Available" : "Not Available"}
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleEditClick(doctor)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    {doctor.available ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">
                          Available
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-600">
                          Not Available
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <AlertCircle size={40} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No doctors found</p>
                <p className="text-gray-500 text-sm">
                  Try adding a new doctor schedule
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
