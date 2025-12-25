import React, { useState, useEffect, useCallback } from "react";
import {
  LogOut,
  Award,
  Phone,
  CheckCircle,
  XCircle,
  UserPlus,
  Clock,
  Home,
  Users,
  User,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";

const API_BASE_URL = "https://b63d0477cea0.ngrok-free.app";
const fetchAPI = async (endpoint, method = "GET", body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

const HomePage = ({ onLogout }) => {
  const [helpers, setHelpers] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  const loadHelpers = useCallback(async () => {
    setLoading(true);
    try {
      const statusMap = {
        all: null,
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
      };

      let response;

      if (filter === "all") {
        // Get all helpers pagination
        response = await fetchAPI(
          `/getAllHelperProfile?pageNumber=${currentPage}&pageSize=${pageSize}`
        );
      } else {
        // Get helpers by status pagination
        const statusValue = statusMap[filter];
        response = await fetchAPI(
          `/getHelperProfileByStatus?status=${statusValue}&pageNumber=${currentPage}&pageSize=${pageSize}`
        );
      }

      const helpersData = response?.data?.items ?? [];
      const totalItems = response?.data?.totalItems ?? 0;

      const mappedHelpers = helpersData.map((h, index) => ({
        id: index,
        name: h.userName,
        contact: h.phoneNumber,
        email: h.email,
        age: h.age,
        gender: h.gender,
        experience: h.qualification,
        pricePerHour: h.pricePerHour,
        status: h.status,
        addedDate: h.addedDate,
        description: h.description,
      }));

      setHelpers(mappedHelpers);
      setTotalRecords(totalItems);
    } catch (err) {
      console.error("Error loading helpers:", err);
      setHelpers([]);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, pageSize]);

  useEffect(() => {
    loadHelpers();
  }, [loadHelpers]);

  const handleAccept = async (helperId) => {
    try {
      await fetchAPI(`/updateHelperProfileStatus`, "POST", {
        userName: helpers[helperId]?.name,
        phoneNumber: helpers[helperId]?.contact,
        updatedStatus: "Approved",
      });
      loadHelpers();
      setSelectedHelper(null);
      alert("Helper accepted successfully!");
    } catch (err) {
      console.error("Error accepting helper:", err);
      alert("Failed to accept helper");
    }
  };

  const handleReject = async (helperId) => {
    try {
      await fetchAPI(`/updateHelperProfileStatus`, "POST", {
        userName: helpers[helperId]?.name,
        phoneNumber: helpers[helperId]?.contact,
        updatedStatus: "Rejected",
      });
      loadHelpers();
      setSelectedHelper(null);
      alert("Helper rejected successfully!");
    } catch (err) {
      console.error("Error rejecting helper:", err);
      alert("Failed to reject helper");
    }
  };

  const stats = {
    total: totalRecords,
    approved: Array.isArray(helpers)
      ? helpers.filter((h) => h.status === "Approved").length
      : 0,
    pending: Array.isArray(helpers)
      ? helpers.filter((h) => h.status === "Pending").length
      : 0,
    rejected: Array.isArray(helpers)
      ? helpers.filter((h) => h.status === "Rejected").length
      : 0,
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  const menuItems = [
    { id: "home", icon: Home, label: "Dashboard" },
    { id: "helpers", icon: Users, label: "Helper Details" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const filterOptions = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  const isHelperPendingApproval = (helper) => {
    return helper.status === "Pending";
  };

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
              <p className="text-xs text-gray-500">Care Management</p>
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
        {/* Navigation Bar  */}
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
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back, Administrator
                </p>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              S
            </div>
          </div>
        </nav>

        {/* Main Content Yata*/}
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Manage helper applications and inquiries
            </p>
          </div>

          {/* Stats Cards Yata*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Helpers",
                value: stats.total,
                icon: UserPlus,
                color: "blue",
              },
              {
                label: "Approved",
                value: stats.approved,
                icon: CheckCircle,
                color: "green",
              },
              {
                label: "Pending",
                value: stats.pending,
                icon: Clock,
                color: "yellow",
              },
              {
                label: "Rejected",
                value: stats.rejected,
                icon: XCircle,
                color: "red",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </span>
                    <div
                      className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <Icon size={20} className={`text-${stat.color}-600`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Filter Section Yata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Filter Helpers
            </h3>
            <div className="flex gap-3 flex-wrap">
              {filterOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State Yata */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {helpers.map((helper) => (
                  <div
                    key={helper.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
                    onClick={() => setSelectedHelper(helper)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {helper.name?.charAt(0) || "H"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {helper.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {helper.age} years old
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Award size={16} className="text-blue-600" />
                        </div>
                        <span>{helper.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <Phone size={16} className="text-indigo-600" />
                        </div>
                        <span>{helper.contact}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          helper.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : helper.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {helper.status}
                      </span>
                    </div>
                    {isHelperPendingApproval(helper) && (
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(helper.id);
                          }}
                          className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-semibold shadow-lg shadow-green-200"
                        >
                          Accept Helper
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(helper.id);
                          }}
                          className="flex-1 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all text-sm font-semibold shadow-lg shadow-red-200"
                        >
                          Reject Helper
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {helpers.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  No helpers found
                </div>
              )}

              {/* Pagination Yata */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedHelper.name?.charAt(0) || "H"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedHelper.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedHelper.age} years old
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHelper(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Experience
                </label>
                <p className="text-gray-800">
                  {selectedHelper.experience} years
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Contact
                </label>
                <p className="text-gray-800">{selectedHelper.contact}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Status
                </label>
                <p
                  className={
                    selectedHelper.status === "Approved"
                      ? "text-green-600"
                      : selectedHelper.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {selectedHelper.status}
                </p>
              </div>
              {isHelperPendingApproval(selectedHelper) && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      handleAccept(selectedHelper.id);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
                  >
                    Accept Helper
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedHelper.id);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all font-semibold"
                  >
                    Reject Helper
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
