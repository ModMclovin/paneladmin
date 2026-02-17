// FilterBar.js
import React from "react";

const filterOptions = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const FilterBar = ({ filter, setFilter, setCurrentPage }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
     
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFilter(f.id);
              setCurrentPage(1);
            }}
            className={`px-4 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === f.id
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
