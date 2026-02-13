import React, { useEffect, useState, useMemo } from "react";
import { fetchAPI } from "../../api/fetchApi";
import DepositCard from "../../components/Admin/DepositCard";

const PatientDepositsPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchHospital, setSearchHospital] = useState("");
  const [searchPatient, setSearchPatient] = useState("");

  const loadDeposits = async () => {
    setLoading(true);
    try {
      const response = await fetchAPI("/getPatientsDeposit");
      setDeposits(response?.data ?? response ?? []);
    } catch (error) {
      console.error("Error loading deposits:", error);
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits();
  }, []);

  // ✅ Filter Logic
  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const hospitalMatch = deposit.hospitalName
        ?.toLowerCase()
        .includes(searchHospital.toLowerCase());

      const patientMatch = deposit.purchaseOrderName
        ?.toLowerCase()
        .includes(searchPatient.toLowerCase());

      return hospitalMatch && patientMatch;
    });
  }, [deposits, searchHospital, searchPatient]);

  return (
    <div className="space-y-6">

      {/* 🔎 Filter Section */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4">

          {/* Hospital Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Search by Hospital
            </label>
            <input
              type="text"
              value={searchHospital}
              onChange={(e) => setSearchHospital(e.target.value)}
              placeholder="Enter hospital name..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Patient Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Search by Patient
            </label>
            <input
              type="text"
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              placeholder="Enter patient name..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Clear Button */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchHospital("");
                setSearchPatient("");
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* 🔄 Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* ❌ Empty State */}
      {!loading && filteredDeposits.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No deposit records found
        </div>
      )}

      {/* ✅ Deposit Cards */}
      {!loading && filteredDeposits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDeposits.map((deposit, index) => (
            <DepositCard key={index} deposit={deposit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDepositsPage;
