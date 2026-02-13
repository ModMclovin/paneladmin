// HelperModal.js
import React from "react";
import { X } from "lucide-react";

const HelperModal = ({ helper, onClose, onStatusChange }) => {
  const isPending = helper.status === "Pending";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {helper.name?.charAt(0) || "H"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{helper.name}</h2>
              <p className="text-gray-600">{helper.age} years old</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Experience</label>
            <p className="text-gray-800">{helper.experience} years</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">Contact</label>
            <p className="text-gray-800">{helper.contact}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">Status</label>
            <p
              className={
                helper.status === "Approved"
                  ? "text-green-600"
                  : helper.status === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {helper.status}
            </p>
          </div>

          {isPending && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onStatusChange(helper.id, "Approved")}
                className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold"
              >
                Approve
              </button>
              <button
                onClick={() => onStatusChange(helper.id, "Rejected")}
                className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all font-semibold"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelperModal;
