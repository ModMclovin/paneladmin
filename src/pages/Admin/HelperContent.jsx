import React from "react";
import FilterBar from "../../components/Admin/FilterBar";
import HelpersGrid from "../../components/Admin/HelpersGrid";

const HelperContent = ({
  filter,
  setFilter,
  setCurrentPage,
  helpers,
  loading,
  handleStatusChange,
  currentPage,
  totalPages
}) => {

  return (
    <>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        setCurrentPage={setCurrentPage}
      />

      <HelpersGrid
        helpers={helpers}
        loading={loading}
        onStatusChange={handleStatusChange}
      />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">

          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next
          </button>

        </div>
      )}

    </>
  );
};

export default HelperContent;
