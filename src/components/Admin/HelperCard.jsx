// HelperCard.js
import React from "react";
import { Award, Phone, CheckCircle, Clock, XCircle } from "lucide-react";

const HelperCard = ({ helper, onClick, onStatusChange }) => {
  const isPending = helper.status === "Pending";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {helper.name?.charAt(0) || "H"}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-lg">{helper.name}</h3>
          <p className="text-sm text-gray-500">{helper.age} years old</p>
        </div>
      </div>

      <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Award size={16} className="text-blue-600" />
          </div>
          <span>{helper.experience} years experience</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Phone size={16} className="text-indigo-600" />
          </div>
          <span>{helper.contact}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            helper.status === "Approved"
              ? "bg-green-100 text-green-700"
              : helper.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {helper.status}
        </span>
      </div>

      {isPending && (
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(helper.id, "Approved");
            }}
            className="flex-1 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-semibold shadow-lg shadow-green-200"
          >
            Approve
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(helper.id, "Rejected");
            }}
            className="flex-1 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all text-sm font-semibold shadow-lg shadow-red-200"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default HelperCard;
