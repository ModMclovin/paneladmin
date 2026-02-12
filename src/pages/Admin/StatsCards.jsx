// StatsCards.js
import React from "react";
import { UserPlus, CheckCircle, Clock, XCircle } from "lucide-react";

const StatsCards = ({ stats }) => {
  const statData = [
    { label: "Total Helpers", value: stats.total, icon: UserPlus, color: "blue" },
    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "green" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "yellow" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "red" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statData.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">{stat.label}</span>
              <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <Icon size={20} className={`text-${stat.color}-600`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
