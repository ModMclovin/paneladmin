// Keep imports as-is
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Building2 } from "lucide-react";
import Cookies from "js-cookie";

const LoginOthersPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  const navigate = useNavigate();

  // 🔹 Fetch hospitals
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("https://localhost:7252/getAllHospital");
        const result = await response.json();

        if (result.isSuccess) {
          setHospitals(result.data);
        } else {
          setError("Failed to load hospitals");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching hospitals");
      } finally {
        setLoadingHospitals(false);
      }
    };

    fetchHospitals();
  }, []);

  // 🔹 Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // 🔹 Handle login
  const handleLogin = async () => {
    setError("");

    if (!selectedHospital) {
      setError("Please select a hospital");
      return;
    }

    if (!username.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://192.168.18.221:5237/SignInUser/SpecifiedRole",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "X-Tenant-Id": selectedHospital,
          },
          body: JSON.stringify({
            phoneNumber: username,
            password: password,
          }),
        }
      );

      const result = await response.json();

      if (result.isSuccess) {
        const token = result.data.token;
        const role = result.data.role;

        // Save in cookies
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("tenantId", selectedHospital, { expires: 1 });
        Cookies.set("role", role, { expires: 1 });

        alert("Login Successful!");

        // Navigate
        if (role === "Receptionist") {
          navigate("/reception");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
                  disabled={loadingHospitals}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white"
                >
                  <option value="">
                    {loadingHospitals
                      ? "Loading hospitals..."
                      : "-- Choose a Hospital --"}
                  </option>

                  {hospitals.map((hospital) => (
                    <option key={hospital.tenantId} value={hospital.tenantId}>
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
                  onKeyDown={handleKeyPress} // ✅ fixed
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
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
                  onKeyDown={handleKeyPress} // ✅ fixed
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
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

            {/* Register Navigation */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don’t have a role yet?{" "}
                <button
                  onClick={() => navigate("/registerPage")}
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOthersPage;
