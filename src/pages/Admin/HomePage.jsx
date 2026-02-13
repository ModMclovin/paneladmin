// HomePage.js
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/Admin/SideBar";
import Navbar from "../../components/Admin/Navbar";
import StatsCards from "../../components/Admin/StatsCards";
import FilterBar from "../../components/Admin/FilterBar";
import HelpersList from "../../components/Admin/HelperList";
import HelperModal from "../../components/Admin/HelperModal";
import PatientDepositsPage from './PatientDepositPage';
import HospitalsPage from './HospitalPage';
import { fetchAPI } from '../../api/fetchApi';

const pageSize = 10;
// utils/api.js


const HomePage = ({ onLogout }) => {
  const [helpers, setHelpers] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

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
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={onLogout}
    />

    <div className="lg:ml-64">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="p-4 md:p-8">

        {activeTab === "home" && (
          <>
            <StatsCards stats={stats} />

            <FilterBar
              filter={filter}
              setFilter={setFilter}
              setCurrentPage={setCurrentPage}
            />

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
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
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

        {activeTab === "deposits" && <PatientDepositsPage />}
        {activeTab === "hospitals" && <HospitalsPage />}

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
}


export default HomePage;
