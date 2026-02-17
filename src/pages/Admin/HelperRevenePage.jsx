import React, { useEffect, useState, useMemo } from "react";
import { fetchAPI } from "../../api/fetchApi";
import HelperRevenueGrid from "../../components/Admin/HelperRevenueGrid";

const HelperRevenuePage = () => {
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchHelper, setSearchHelper] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadRevenues = async () => {
    setLoading(true);
    try {
        debugger;
      const response = await fetchAPI("/getAllHelperRevenue");
      setRevenues(response?.data ?? response ?? []);
    } catch (error) {
      console.error("Error loading helper revenue:", error);
      setRevenues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenues();
  }, []);

  const filteredRevenues = useMemo(() => {
    return revenues.filter((rev) => {
      const helperMatch = rev.helperName
        ?.toLowerCase()
        .includes(searchHelper.toLowerCase());
      const phoneMatch = rev.phoneNumber
        ?.toLowerCase()
        .includes(searchPhone.toLowerCase());

      let dateMatch = true;
      if (rev.addedDate) {
        const added = new Date(rev.addedDate);
        if (fromDate) dateMatch = dateMatch && added >= new Date(fromDate);
        if (toDate) {
          const end = new Date(toDate);
          end.setHours(23, 59, 59, 999);
          dateMatch = dateMatch && added <= end;
        }
      }
      return helperMatch && phoneMatch && dateMatch;
    });
  }, [revenues, searchHelper, searchPhone, fromDate, toDate]);

  return (
    <div className="space-y-4">

      {/* 🔎 Compact Filter Section */}
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-end gap-2">

          <div className="w-36">
            <label className="block text-[10px] font-semibold text-gray-600 mb-1">
              Helper Name
            </label>
            <input
              type="text"
              value={searchHelper}
              onChange={(e) => setSearchHelper(e.target.value)}
              placeholder="Helper..."
              className="w-full px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="w-28">
            <label className="block text-[10px] font-semibold text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Phone..."
              className="w-full px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="w-28">
            <label className="block text-[10px] font-semibold text-gray-600 mb-1">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="w-28">
            <label className="block text-[10px] font-semibold text-gray-600 mb-1">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={() => {
              setSearchHelper("");
              setSearchPhone("");
              setFromDate("");
              setToDate("");
            }}
            className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Clear
          </button>

        </div>
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* ❌ Empty */}
      {!loading && filteredRevenues.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No helper revenue records found
        </div>
      )}

      {/* ✅ Table */}
     {/* ✅ Revenue Table using DataGrid */}
{!loading && filteredRevenues.length > 0 && (
  <div className="border rounded-lg">
    <HelperRevenueGrid filteredRevenues={filteredRevenues} />
  </div>
)}


    </div>
  );
};

export default HelperRevenuePage;
