// HomePage.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Admin/SideBar";
import HelperModal from "../../components/Admin/HelperModal";
import PatientDepositsPage from './PatientDepositPage';
import HospitalsPage from './HospitalPage';
import HelperRevenuePage from "./HelperRevenePage";
import { fetchAPI } from '../../api/fetchApi';
import DashboardPage from "./DashboardPage";
import TopBar from "../../components/Admin/TopBar";
import HelperContent from "./HelperContent";
const pageSize = 10;

/* ══════════════════════════════════════
   HOME PAGE
══════════════════════════════════════ */
const HomePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [helpers, setHelpers] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // ── Prevent back-navigation after logout ──────────────────
  useEffect(() => {
    // Push a duplicate entry so pressing Back stays on this page
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ── Logout handler ────────────────────────────────────────
  const handleLogout = useCallback(() => {
    // Clear all auth tokens / session data
    localStorage.clear();
    sessionStorage.clear();
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  });
    // Call parent onLogout if provided
    if (typeof onLogout === "function") onLogout();

    // Replace current history entry so Back button can't return here
    navigate("/superAdminlogin", { replace: true });
  }, [navigate, onLogout]);

  // ── Load Helpers ──────────────────────────────────────────
  const loadHelpers = useCallback(async () => {
    setLoading(true);
    try {
      const statusMap = { all: null, pending: "Pending", approved: "Approved", rejected: "Rejected" };
      let response;
      if (filter === "all") {
        response = await fetchAPI(`/getAllHelperProfile?pageNumber=${currentPage}&pageSize=${pageSize}`);
      } else {
        response = await fetchAPI(`/getHelperProfileByStatus?status=${statusMap[filter]}&pageNumber=${currentPage}&pageSize=${pageSize}`);
      }
      const helpersData = response?.data?.items ?? [];
      setHelpers(helpersData.map((h, i) => ({
        id: i, name: h.userName, phoneNumber: h.phoneNumber,
        email: h.email, age: h.age, gender: h.gender,
        qualification: h.qualification, pricePerHour: h.pricePerHour,
        status: h.status, addedDate: h.addedDate, description: h.description,
      })));
      setTotalRecords(response?.data?.totalItems ?? 0);
    } catch (err) {
      console.error("Error loading helpers:", err);
      setHelpers([]);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage]);

  useEffect(() => { loadHelpers(); }, [loadHelpers]);

  const handleStatusChange = async (helper, status) => {
    try {
      await fetchAPI("/updateHelperProfileStatus", "POST", {
        userName: helper?.name,
        phoneNumber: helper?.phoneNumber,
        updatedStatus: status,
      });
      loadHelpers();
      setSelectedHelper(null);
      alert(`Helper ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Error updating helper status:", err);
      alert("Failed to update helper status");
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="min-h-screen flex relative">

      {/* SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-auto relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

        {/* TOP BAR */}
        <TopBar
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onLogout={handleLogout}
        />

        {/* PAGE CONTENT */}
        <div className="p-4 md:p-8 flex-1 space-y-6" style={{ paddingTop: "76px" }}>
        {activeTab === "home" && (

<HelperContent
   filter={filter}
   setFilter={setFilter}
   setCurrentPage={setCurrentPage}
   helpers={helpers}
   loading={loading}
   handleStatusChange={handleStatusChange}
   currentPage={currentPage}
   totalPages={totalPages}
/>

)}

          {activeTab === "deposits"      && <PatientDepositsPage />}
          {activeTab === "helperRevenue" && <HelperRevenuePage />}
          {activeTab === "hospitals"     && <HospitalsPage />}
           {activeTab === "dashboard"     && <DashboardPage />}
        </div>

        {/* DARK OVERLAY when sidebar open */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 z-30 cursor-pointer"
            style={{ transition: "opacity 0.25s" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* HELPER MODAL */}
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