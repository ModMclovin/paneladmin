import React, { useEffect, useState, useMemo } from "react";
import { fetchAPI } from "../../api/fetchApi";
import DepositGrid from "../../components/Admin/DepositGrid";

const PatientDepositsPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchHospital, setSearchHospital] = useState("");
  const [searchPatient, setSearchPatient] = useState("");

  const loadDeposits = async () => {
    setLoading(true);
    try {
      const response = await fetchAPI("/Admin/getPatientsDeposit");
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
    <div className="space-y-4">

      {/* 🔎 Filter Section */}
      <div className="bg-white p-3 rounded-lg shadow-sm flex flex-wrap items-end gap-2">
        <div className="w-36">
          <label className="block text-[10px] font-semibold text-gray-600 mb-1">
            Hospital
          </label>
          <input
            type="text"
            value={searchHospital}
            onChange={(e) => setSearchHospital(e.target.value)}
            placeholder="Hospital..."
            className="w-full px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="w-36">
          <label className="block text-[10px] font-semibold text-gray-600 mb-1">
            Patient
          </label>
          <input
            type="text"
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            placeholder="Patient..."
            className="w-full px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          onClick={() => {
            setSearchHospital("");
            setSearchPatient("");
          }}
          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Clear
        </button>
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* ❌ Empty */}
      {!loading && filteredDeposits.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No deposit records found
        </div>
      )}

      {/* ✅ DataGrid Table */}
      {!loading && filteredDeposits.length > 0 && (
        <div className="border rounded-lg">
          <DepositGrid deposits={filteredDeposits} />
        </div>
      )}

    </div>
  );
};

export default PatientDepositsPage;
