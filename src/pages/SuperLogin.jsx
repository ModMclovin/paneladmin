import { useState } from "react";
import { LogIn, Building2 } from "lucide-react";

export default function HospitalLogin() {
  const [selectedHospital, setSelectedHospital] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hospitals = [
    { id: 1, name: "Lumbini City Hospital" },
    { id: 2, name: "Raksha Medical Hall" },
    { id: 3, name: "Lumbini Province Hospital" },
    { id: 4, name: "Butwal Hospital" },
  ];

  const handleLogin = () => {
    setError("");

    if (!selectedHospital) {
      setError("Please select a hospital");
      return;
    }
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "kalebhunte") {
        const hospital = hospitals.find(
          (h) => h.id === parseInt(selectedHospital),
        );
        alert(`Welcome to ${hospital.name} Reception Admin Panel!`);
        setSelectedHospital("");
        setUsername("");
        setPassword("");
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Hospital Admin</h1>
          <p className="text-gray-600 mt-2">Reception Management System</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-8">
              Reception Admin Login
            </h2>

            <div className="space-y-5">
              {/* Hospital Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Hospital
                </label>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
                >
                  <option value="">-- Choose a Hospital --</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
