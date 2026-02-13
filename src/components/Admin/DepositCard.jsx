import React from "react";
import { Building2, Phone, Wallet } from "lucide-react";

const DepositCard = ({ deposit }) => {
  const isCompleted = deposit.status === "Completed";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {deposit.purchaseOrderName}
          </h3>
          <p className="text-sm text-gray-500">{deposit.hospitalName}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {deposit.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Wallet size={16} className="text-blue-600" />
          <span>Amount: Rs. {deposit.amount}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Wallet size={16} className="text-indigo-600" />
          <span>Remaining: Rs. {deposit.remainingAmount}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Phone size={16} className="text-green-600" />
          <span>{deposit.mobile}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Building2 size={16} className="text-gray-600" />
          <span>{deposit.hospitalName}</span>
        </div>
      </div>
    </div>
  );
};

export default DepositCard;
