// HelpersList.js
import React from "react";
import HelperCard from "./HelperCard";

const HelpersList = ({ helpers, loading, selectedHelper, setSelectedHelper, onStatusChange }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (helpers.length === 0) {
    return <div className="text-center py-12 text-gray-500">No helpers found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {helpers.map((helper) => (
        <HelperCard
          key={helper.id}
          helper={helper}
          onClick={() => setSelectedHelper(helper)}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default HelpersList;
