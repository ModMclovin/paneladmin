import React from "react";
import {
  X,
  Calendar,
  Award,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";

const HelperModal = ({ helper, onClose, onAccept }) => {
  if (!helper) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Helper Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {helper.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{helper.name}</h4>
              <p className="text-sm text-gray-600">
                Registered: {new Date(helper.registeredAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Age</span>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {helper.age} years
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-gray-600" />
                <span className="text-xs font-medium text-gray-600">
                  Experience
                </span>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {helper.experience} years
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
              <Phone size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">
                  Contact Number
                </p>
                <p className="text-gray-800 font-medium">{helper.contact}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200">
              <Mail size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600">
                  Email Address
                </p>
                <p className="text-gray-800 font-medium">{helper.email}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Skills & Expertise
            </p>
            <p className="text-gray-700 p-3 bg-gray-50 rounded border border-gray-200">
              {helper.skills}
            </p>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
            <span className="font-medium text-gray-700">
              Physical Capability:
            </span>
            {helper.capability === "capable" ? (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle size={16} />
                Capable
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-600 font-medium">
                <XCircle size={16} />
                Not Capable
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
            <span className="font-medium text-gray-700">Status:</span>
            <span
              className={`px-3 py-1 rounded text-sm font-medium ${
                helper.status === "accepted"
                  ? "bg-green-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {helper.status === "accepted" ? "Accepted" : "Pending"}
            </span>
          </div>

          {helper.capability === "capable" && helper.status === "pending" && (
            <button
              onClick={() => onAccept(helper.id)}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium mt-2"
            >
              Accept Helper
            </button>
          )}

          {helper.capability !== "capable" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm font-medium text-center">
              This helper cannot be accepted (marked as not capable)
            </div>
          )}

          {helper.status === "accepted" && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm font-medium text-center">
              ✓ This helper has been accepted
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelperModal;
