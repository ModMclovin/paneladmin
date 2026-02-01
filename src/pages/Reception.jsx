import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  User,
  Settings,
  UserPlus,
  Check,
} from "lucide-react";

const initialPatients = [
  {
    id: 1,
    name: "sita",
    phone: "11111",
    email: "sita@gmail.com",
    registrationDate: "2026-01-05",
  },
  {
    id: 2,
    name: "Rabina",
    phone: "33333",
    email: "rabina@gmail.com",
    registrationDate: "2026-01-06",
  },
  {
    id: 3,
    name: "apsara",
    phone: "22222",
    email: "apsara@gmail.com",
    registrationDate: "2026-01-01",
  },
  {
    id: 4,
    name: "Bill",
    phone: "1111",
    email: "bill@gmail.com",
    registrationDate: "2026-01-07",
  },
  {
    id: 5,
    name: "samrat",
    phone: "98699121",
    email: "samrat@gmail.com",
    registrationDate: "2026-01-08",
  },
];

// Mock data for available helpers
const mockHelpers = [
  {
    id: 1,
    name: "Hari Prasad",
    phone: "9841000001",
    experience: "2 years",
    status: "available",
  },
  {
    id: 2,
    name: "Deepak Kumar",
    phone: "9841000002",
    experience: "3 years",
    status: "available",
  },
  {
    id: 3,
    name: "Priya Singh",
    phone: "9841000003",
    experience: "1.5 years",
    status: "busy",
  },
  {
    id: 4,
    name: "Rajesh Patel",
    phone: "9841000004",
    experience: "4 years",
    status: "available",
  },
  {
    id: 5,
    name: "Anita Sharma",
    phone: "9841000005",
    experience: "2.5 years",
    status: "available",
  },
];

function ReceptionDashboard({ onLogout }) {
  const [patients, setPatients] = useState(initialPatients);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [selectedPatientForHelper, setSelectedPatientForHelper] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Patient name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone))
      newErrors.phone = "Invalid phone format";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    return newErrors;
  };

  // Add patient
  const handleAddPatient = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newPatient = {
      id: Math.max(...patients.map((p) => p.id), 0) + 1,
      ...formData,
      registrationDate: new Date().toISOString().split("T")[0],
    };

    setPatients([...patients, newPatient]);
    setFormData({ name: "", phone: "", email: "" });
    setErrors({});
    setShowModal(false);
    alert("Patient registered successfully!");
  };

  // Filter patients
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm),
  );

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle assign helper
  const handleOpenHelperModal = (patient) => {
    setSelectedPatientForHelper(patient);
    setShowHelperModal(true);
  };

  const handleAssignHelper = (helper) => {
    alert(`${helper.name} assigned to ${selectedPatientForHelper.name}`);
    setShowHelperModal(false);
    setSelectedPatientForHelper(null);
  };

  const menuItems = [
    { id: "view", icon: Users, label: "View Patients" },
    { id: "dashboard", icon: Home, label: "Dashboard" },
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
              <p className="text-xs text-gray-500">Reception Desk</p>
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Reception Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Manage patient registrations
                </p>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              R
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Patient Management
            </h2>
            <p className="text-gray-600">
              Register and manage patient information
            </p>
          </div>

          {activeTab === "view" && (
            <>
              {/* Search and Add Button */}
              <div className="flex gap-4 mb-6 flex-col sm:flex-row">
                <div className="flex-1 relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all font-medium"
                >
                  <Plus size={18} />
                  Add Patient
                </button>
              </div>

              {/* Patients Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {patient.registrationDate}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenHelperModal(patient)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-blue-200"
                          title="Assign a helper to this patient"
                        >
                          <UserPlus size={16} />
                          <span className="hidden sm:inline">Assign</span>
                        </button>
                      </div>

                      <div className="space-y-3 border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">
                            Phone
                          </p>
                          <p className="text-sm text-gray-800">
                            {patient.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">
                            Email
                          </p>
                          <p className="text-sm text-gray-800">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <Users size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No patients found</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Patient
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1-555-0000"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="patient@email.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ name: "", phone: "", email: "" });
                  setErrors({});
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPatient}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all font-medium"
              >
                Register Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Helper Modal */}
      {showHelperModal && selectedPatientForHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Assign Helper
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select a helper for{" "}
                  <span className="font-medium">
                    {selectedPatientForHelper.name}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowHelperModal(false);
                  setSelectedPatientForHelper(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockHelpers.map((helper) => (
                <div
                  key={helper.id}
                  className={`p-4 border rounded-lg transition-all cursor-pointer ${
                    helper.status === "available"
                      ? "border-green-200 bg-green-50 hover:shadow-md hover:border-green-400"
                      : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    helper.status === "available" && handleAssignHelper(helper)
                  }
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {helper.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {helper.name}
                        </h4>
                        <p className="text-xs text-gray-600">{helper.phone}</p>
                      </div>
                    </div>
                    {helper.status === "available" && (
                      <Check
                        size={20}
                        className="text-green-600 flex-shrink-0"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      Experience: {helper.experience}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        helper.status === "available"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {helper.status.charAt(0).toUpperCase() +
                        helper.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowHelperModal(false);
                  setSelectedPatientForHelper(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceptionDashboard;
