import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

const navigateByRole = (role) => {
  debugger;
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
    // case "Admin":
    //   navigate("/admin/dashboard");
    //   break;

    // case "Helper":
    //   navigate("/helper/home");
    //   break;

    // case "User":
    //   navigate("/user/home");
    //   break;

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
        "https://localhost:7252/SignInUser/SpecifiedRole",
        {
          phoneNumber: credentials.phoneNumber,
          password: credentials.password,
        }
      );

      console.log("Login success:", response.data);

      localStorage.setItem("isAdminLoggedIn", "true");
      console.log("User role:", response.data.data.role);
      navigateByRole(response.data.data.role);

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
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Super Admin Login</h2>
            <p className="text-gray-600 text-sm mt-1">
              Hospital Helper Management
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={credentials.phoneNumber}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      phoneNumber: e.target.value,
                    })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
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

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Not registered?</p>
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Register as Helper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
