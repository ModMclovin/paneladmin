// Navbar.js
import React from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 py-4 flex justify-between items-center">
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
    </nav>
  );
};

export default Navbar;
