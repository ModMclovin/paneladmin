import React, { useState, useEffect } from "react";
import {
  LogOut,
  Award,
  Phone,
  CheckCircle,
  XCircle,
  UserPlus,
  Clock,
} from "lucide-react";
import HelperModal from "../components/HelperModal";

const HomePage = ({ onLogout }) => {
  const [helpers, setHelpers] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadHelpers();
  }, []);

  const loadHelpers = () => {
    const stored = JSON.parse(localStorage.getItem("helpers") || "[]");
    setHelpers(stored);
  };

  const handleAccept = (helperId) => {
    const updated = helpers.map((h) =>
      h.id === helperId ? { ...h, status: "accepted" } : h
    );
    setHelpers(updated);
    localStorage.setItem("helpers", JSON.stringify(updated));
    setSelectedHelper(updated.find((h) => h.id === helperId));
    alert("Helper accepted successfully!");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">JeevanCare</h1>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">Applications and Inquiries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Helpers</span>
              <UserPlus size={18} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Capable</span>
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.capable}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pending</span>
              <Clock size={18} className="text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Accepted</span>
              <CheckCircle size={18} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.accepted}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["all", "capable", "pending", "accepted"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredHelpers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <UserPlus className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">No helpers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHelpers.map((helper) => (
              <div
                key={helper.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedHelper(helper)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {helper.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{helper.name}</h3>
                    <p className="text-sm text-gray-600">{helper.age} years</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3 pb-3 border-b">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award size={14} />
                    <span>{helper.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <span>{helper.contact}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    {helper.capability === "capable" ? (
                      <>
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-green-600 font-medium">
                          Capable
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-red-600" />
                        <span className="text-red-600 font-medium">
                          Not Capable
                        </span>
                      </>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
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
                      className="w-full mt-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
                    >
                      Accept Helper
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedHelper && (
        <HelperModal
          helper={selectedHelper}
          onClose={() => setSelectedHelper(null)}
          onAccept={handleAccept}
        />
      )}
    </div>
  );
};

export default HomePage;
