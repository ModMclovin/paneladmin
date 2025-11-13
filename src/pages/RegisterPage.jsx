import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    experience: "",
    contact: "",
    email: "",
    skills: "",
    capability: "capable",
  });
  const [registered, setRegistered] = useState(false);

  const handleRegister = () => {
    if (
      !formData.name ||
      !formData.age ||
      !formData.experience ||
      !formData.contact ||
      !formData.email ||
      !formData.skills
    ) {
      alert("Please fill all fields");
      return;
    }

    const helpers = JSON.parse(localStorage.getItem("helpers") || "[]");
    helpers.push({
      id: Date.now().toString(),
      ...formData,
      status: "pending",
      registeredAt: new Date().toISOString(),
    });
    localStorage.setItem("helpers", JSON.stringify(helpers));
    setRegistered(true);

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Registration Successful!
          </h3>
          <p className="text-gray-600">
            Your application has been submitted for review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Helper Registration
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Fill in your details to apply
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                Admin Login
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  min="18"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Years of experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+977-XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills *
                </label>
                <textarea
                  rows="3"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="e.g., Patient care, First aid, Medicine management"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Physical Capability
                </label>
                <select
                  value={formData.capability}
                  onChange={(e) =>
                    setFormData({ ...formData, capability: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="capable">
                    Capable - Can handle physical tasks
                  </option>
                  <option value="not-capable">
                    Not Capable - Limited physical ability
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleRegister}
                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
              >
                Submit Application
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
