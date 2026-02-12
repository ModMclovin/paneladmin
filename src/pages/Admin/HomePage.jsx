// HomePage.js
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./SideBar";
import Navbar from "./Navbar";
import StatsCards from "./StatsCards";
import FilterBar from "./FilterBar";
import HelpersList from "./HelperList";
import HelperModal from "./HelperModal";
//import { fetchAPI } from ".../utils/api";

const pageSize = 10;
// utils/api.js
const API_BASE_URL = "https://localhost:7252";

// Helper to get token from cookies
export const getTokenFromCookies = () => {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  if (match) return match[2];
  return null;
};

/**
 * Generic API fetch wrapper
 * @param {string} endpoint - API endpoint starting with "/"
 * @param {string} method - HTTP method: GET, POST, PUT, DELETE
 * @param {Object|null} body - Request body if POST/PUT
 * @returns {Promise<any>} - JSON response
 */
export const fetchAPI = async (endpoint, method = "GET", body = null) => {
  const token = getTokenFromCookies();

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${text}`);
  }

  return await response.json();
};

const HomePage = ({ onLogout }) => {
  const [helpers, setHelpers] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

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
        response = await fetchAPI(
          `/getAllHelperProfile?pageNumber=${currentPage}&pageSize=${pageSize}`
        );
      } else {
        const statusValue = statusMap[filter];
        response = await fetchAPI(
          `/getHelperProfileByStatus?status=${statusValue}&pageNumber=${currentPage}&pageSize=${pageSize}`
        );
      }

      const helpersData = response?.data?.items ?? [];
      const totalItems = response?.data?.totalItems ?? 0;

      setHelpers(
        helpersData.map((h, index) => ({
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
        }))
      );
      setTotalRecords(totalItems);
    } catch (err) {
      console.error("Error loading helpers:", err);
      setHelpers([]);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage]);

  useEffect(() => {
    loadHelpers();
  }, [loadHelpers]);

  const handleStatusChange = async (helperId, status) => {
    try {
      await fetchAPI("/updateHelperProfileStatus", "POST", {
        userName: helpers[helperId]?.name,
        phoneNumber: helpers[helperId]?.contact,
        updatedStatus: status,
      });
      loadHelpers();
      setSelectedHelper(null);
      alert(`Helper ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error(`Error updating helper status:`, err);
      alert("Failed to update helper status");
    }
  };

  const stats = {
    total: totalRecords,
    approved: helpers.filter((h) => h.status === "Approved").length,
    pending: helpers.filter((h) => h.status === "Pending").length,
    rejected: helpers.filter((h) => h.status === "Rejected").length,
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activeTab="home"
        onLogout={onLogout}
      />

      <div className="lg:ml-64">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="p-4 md:p-8">
          <StatsCards stats={stats} />
          <FilterBar filter={filter} setFilter={setFilter} setCurrentPage={setCurrentPage} />

          <HelpersList
            helpers={helpers}
            loading={loading}
            selectedHelper={selectedHelper}
            setSelectedHelper={setSelectedHelper}
            onStatusChange={handleStatusChange}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
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
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedHelper && (
        <HelperModal
          helper={selectedHelper}
          onClose={() => setSelectedHelper(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default HomePage;
