import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie"; // 🔹 import js-cookie

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateByRole = (role) => {
    switch (role) {
      case "SuperAdmin":
        navigate("/superadmin");
        break;
      case "HospitalAdmin":
        navigate("/hospital");
        break;
      case "Reception":
        navigate("/reception");
        break;
      default:
        navigate("/unauthorized");
        break;
    }
  };

  const handleLogin = async () => {
    setLoginError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.18.221:5237/SignInUser/SpecifiedRole",
        {
          phoneNumber: credentials.phoneNumber,
          password: credentials.password,
        }
      );

      console.log("Login success:", response.data);

      if (response.data.isSuccess) {
        const { token, role } = response.data.data;

        // 🔹 Save token in cookies
        Cookies.set("token", token, { expires: 1 }); // 1 day
        Cookies.set("role", role, { expires: 1 });

        // Optional: localStorage flag
        localStorage.setItem("isAdminLoggedIn", "true");

        // Navigate
        navigateByRole(role);
      } else {
        setLoginError(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Invalid phone number or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-26 h-26rounded-lg flex items-center justify-center mx-auto mb-4">
              <img
        src="src\images\JeevanCare.png"   // <-- your image path
      
        className="w-20 h-20 object-contain"
      />
            </div>
            <h2 className="text-2xl text-blue-600 font-bold ">
              Super Admin Login
            </h2>
           
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={credentials.phoneNumber}
                  onChange={(e) =>
                    setCredentials({ ...credentials, phoneNumber: e.target.value })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Not a super admin?</p>
            <button
              onClick={() => navigate("/otherslogin")}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Login as others!{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
