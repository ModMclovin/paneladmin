// Sidebar.js
import React from "react";
import { Home, Users, BarChart3, User, Settings, LogOut } from "lucide-react";

const menuItems = [
   { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "home", icon: Home, label: "Helper Requests" },
 
  { id: "deposits", icon: Users, label: "Patient Deposit" },
  { id: "helperRevenue", icon: BarChart3, label: "Helper Revenue" },
  { id: "hospitals", icon: User, label: "Hospitals" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const Sidebar = ({ open, setOpen, activeTab, setActiveTab, onLogout }) => {
  return (
    <>
      <aside
  className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"} w-64`}
>

        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <img
            src="src/images/JeevanCare.png"
            alt="JeevanCare"
            className="w-8 h-8 object-contain"
          />
          <h2 className="text-xl text-blue-600 font-bold">JeevanCare</h2>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setOpen(false); // close sidebar on mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    activeTab === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
