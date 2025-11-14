import React, { useState, useEffect } from "react";
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
  Settings,
  BarChart3,
  Menu,
  X,
} from "lucide-react";

export default function App() {
  const [helpers, setHelpers] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const mockHelpers = [
      {
        id: 1,
        name: "Ramesh Kumar",
        age: 35,
        experience: 8,
        contact: "+977-9841234567",
        capability: "capable",
        status: "pending",
      },
      {
        id: 2,
        name: "Sita Devi",
        age: 42,
        experience: 12,
        contact: "+977-9841234568",
        capability: "capable",
        status: "accepted",
      },
      {
        id: 3,
        name: "Krishna Bahadur",
        age: 28,
        experience: 3,
        contact: "+977-9841234569",
        capability: "not capable",
        status: "pending",
      },
    ];
    setHelpers(mockHelpers);
  }, []);

  const handleAccept = (helperId) => {
    setHelpers(
      helpers.map((h) => (h.id === helperId ? { ...h, status: "accepted" } : h))
    );
  };

  const filteredHelpers = helpers.filter((h) => {
    if (filter === "capable") return h.capability === "capable";
    if (filter === "pending") return h.status === "pending";
    if (filter === "accepted") return h.status === "accepted";
    return true;
  });

  const stats = {
    total: helpers.length,
    capable: helpers.filter((h) => h.capability === "capable").length,
    pending: helpers.filter((h) => h.status === "pending").length,
    accepted: helpers.filter((h) => h.status === "accepted").length,
  };

  const menuItems = [
    { id: "home", icon: Home, label: "Dashboard" },
    { id: "helpers", icon: Users, label: "Helper Details" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
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
              A
            </div>
          </div>
        </nav>

        <div className="p-4 md:p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Manage helper applications and inquiries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Helpers",
                value: stats.total,
                icon: UserPlus,
                color: "blue",
              },
              {
                label: "Capable",
                value: stats.capable,
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
                label: "Accepted",
                value: stats.accepted,
                icon: CheckCircle,
                color: "emerald",
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Filter Helpers
            </h3>
            <div className="flex gap-3 flex-wrap">
              {["all", "capable", "pending", "accepted"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHelpers.map((helper) => (
              <div
                key={helper.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedHelper(helper)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {helper.name.charAt(0)}
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
                  <div className="flex items-center gap-2 text-sm">
                    {helper.capability === "capable" ? (
                      <>
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="text-green-600 font-semibold">
                          Capable
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} className="text-red-600" />
                        <span className="text-red-600 font-semibold">
                          Not Capable
                        </span>
                      </>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      helper.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {helper.status === "accepted" ? "Accepted" : "Pending"}
                  </span>
                </div>
                {helper.capability === "capable" &&
                  helper.status === "pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(helper.id);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-semibold shadow-lg shadow-green-200"
                    >
                      Accept Helper
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedHelper.name.charAt(0)}
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
                  Capability
                </label>
                <p
                  className={
                    selectedHelper.capability === "capable"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {selectedHelper.capability === "capable"
                    ? "Capable"
                    : "Not Capable"}
                </p>
              </div>
              {selectedHelper.capability === "capable" &&
                selectedHelper.status === "pending" && (
                  <button
                    onClick={() => {
                      handleAccept(selectedHelper.id);
                      setSelectedHelper(null);
                    }}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
                  >
                    Accept Helper
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
