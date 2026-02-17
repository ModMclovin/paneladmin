import React from "react";

const HelperRow = ({ helper, onStatusChange }) => {
  const isPending = helper.status === "Pending";

  return (
    <tr className="bg-white hover:bg-gray-50 border-b text-xs whitespace-nowrap">
      <td className="px-2 py-1 font-semibold">{helper.name}</td>
      <td className="px-2 py-1">{helper.age}</td>
      <td className="px-2 py-1">{helper.gender}</td>
      <td className="px-2 py-1">{helper.qualification}</td>
      <td className="px-2 py-1">{helper.pricePerHour}</td>
      <td className="px-2 py-1">{helper.phoneNumber}</td>
      <td className="px-2 py-1">{helper.email}</td>
   
      <td className="px-2 py-1">
        {helper.addedDate
          ? new Date(helper.addedDate).toLocaleDateString()
          : "-"}
      </td>
      <td className="px-2 py-1">
        <span
          className={`px-2 py-1 rounded text-[10px] font-semibold ${
            helper.status === "Approved"
              ? "bg-green-100 text-green-700"
              : helper.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {helper.status}
        </span>
      </td>
      <td className="px-2 py-1">
        {isPending && (
          <div className="flex gap-1">
            <button
              onClick={() => onStatusChange(helper.id, "Approved")}
              className="px-2 py-1 text-[10px] bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => onStatusChange(helper.id, "Rejected")}
              className="px-2 py-1 text-[10px] bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default HelperRow;
