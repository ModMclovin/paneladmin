// SuperAdminLogin.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sa-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8faff;
    font-family: 'Outfit', ui-sans-serif, sans-serif;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  /* Subtle background blobs */
  .sa-root::before {
    content: "";
    position: fixed;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%);
    top: -200px; right: -200px;
    pointer-events: none;
  }
  .sa-root::after {
    content: "";
    position: fixed;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
    bottom: -150px; left: -100px;
    pointer-events: none;
  }

  .sa-card {
    width: 100%;
    max-width: 380px;
    background: #fff;
    border-radius: 20px;
    padding: 40px 36px;
    border: 1px solid #e8edf5;
    box-shadow:
      0 1px 3px rgba(0,0,0,0.04),
      0 8px 24px rgba(0,0,0,0.07),
      0 32px 64px rgba(37,99,235,0.06);
    position: relative;
    z-index: 1;
    animation: fadeUp 0.5s cubic-bezier(0.34,1.4,0.64,1) both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Brand ── */
  .sa-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
  }
  .sa-logo-ring {
    width: 60px; height: 60px;
    border-radius: 16px;
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(37,99,235,0.3);
    margin-bottom: 14px;
  }
  .sa-title {
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.3px;
    margin-bottom: 3px;
  }
  .sa-sub {
    font-size: 12.5px;
    color: #9ca3af;
    font-weight: 400;
  }

  /* ── Divider ── */
  .sa-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
    margin-bottom: 24px;
  }

  /* ── Fields ── */
  .sa-field { margin-bottom: 14px; }
  .sa-label {
    display: block;
    font-size: 11.5px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 5px;
    letter-spacing: 0.1px;
  }
  .sa-input-wrap { position: relative; }
  .sa-input-icon {
    position: absolute;
    left: 11px; top: 50%;
    transform: translateY(-50%);
    color: #c4c9d4;
    display: flex; align-items: center;
    pointer-events: none;
    transition: color 0.15s;
  }
  .sa-input {
    width: 100%;
    height: 40px;
    padding: 0 12px 0 36px;
    font-size: 13.5px;
    font-family: 'Outfit', ui-sans-serif, sans-serif;
    border: 1.5px solid #e8edf5;
    border-radius: 10px;
    outline: none;
    background: #fafbff;
    color: #111827;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  .sa-input::placeholder { color: #d1d5db; }
  .sa-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
    background: #fff;
  }
  .sa-input:focus + .sa-input-icon,
  .sa-input-wrap:focus-within .sa-input-icon { color: #3b82f6; }

  /* password toggle */
  .sa-eye {
    position: absolute;
    right: 10px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    cursor: pointer; color: #c4c9d4;
    display: flex; align-items: center;
    padding: 0; transition: color 0.15s;
  }
  .sa-eye:hover { color: #6b7280; }

  /* ── Error ── */
  .sa-error {
    display: flex; align-items: flex-start; gap: 7px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 9px;
    padding: 9px 11px;
    margin-bottom: 14px;
    animation: shake 0.35s ease;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-4px); }
    40%,80%  { transform: translateX(4px); }
  }
  .sa-error-text { font-size: 12px; color: #dc2626; line-height: 1.4; }

  /* ── Button ── */
  .sa-btn {
    width: 100%; height: 42px;
    background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
    color: #fff; border: none; border-radius: 10px;
    font-size: 13.5px; font-weight: 600;
    font-family: 'Outfit', ui-sans-serif, sans-serif;
    cursor: pointer; margin-top: 6px;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    box-shadow: 0 3px 12px rgba(37,99,235,0.35);
    transition: all 0.2s;
  }
  .sa-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    box-shadow: 0 6px 20px rgba(37,99,235,0.42);
    transform: translateY(-1px);
  }
  .sa-btn:active:not(:disabled) { transform: translateY(0); }
  .sa-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .sa-spinner {
    width: 15px; height: 15px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    animation: spin 0.7s linear infinite;
  }

  /* ── Footer ── */
  .sa-footer {
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid #f3f4f6;
    text-align: center;
  }
  .sa-footer-text { font-size: 12px; color: #9ca3af; margin-bottom: 4px; }
  .sa-footer-btn {
    background: none; border: none;
    color: #2563eb; font-size: 12.5px; font-weight: 600;
    font-family: 'Outfit', ui-sans-serif, sans-serif;
    cursor: pointer; padding: 0;
    transition: color 0.15s;
  }
  .sa-footer-btn:hover { color: #1d4ed8; text-decoration: underline; }
`;

/* ── Icons ── */
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.53 2 2 0 0 1 3.6 1.36h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l1.83-1.83a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ phoneNumber: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateByRole = (role) => {
    const map = { SuperAdmin: "/superadmin", HospitalAdmin: "/hospital", Reception: "/reception" };
    navigate(map[role] ?? "/unauthorized");
  };

  const handleLogin = async () => {
    setLoginError("");
    if (!credentials.phoneNumber.trim()) return setLoginError("Phone number is required.");
    if (!credentials.password.trim())    return setLoginError("Password is required.");
    setLoading(true);
    try {
      const response = await axios.post("http://192.168.18.221:5237/api/Auth/SignInUser/SpecifiedRole", {
        phoneNumber: credentials.phoneNumber,
        password: credentials.password,
      });
      if (response.data.isSuccess) {
        const { token, role } = response.data.data;
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("role", role,  { expires: 1 });
        localStorage.setItem("isAdminLoggedIn", "true");
        navigateByRole(role);
      } else {
        setLoginError(response.data.message || "Login failed.");
      }
    } catch {
      setLoginError("Invalid phone number or password.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <>
      <style>{styles}</style>
      <div className="sa-root">
        <div className="sa-card">

          
  <div className="flex items-center gap-8  items-center justify-center">
  {/* Image */}
  <img 
    src="src/images/JeevanCare.png" // your image src
    alt="Hospital"
    className="w-20 h-15" // adjust size as needed
  />

  {/* Text */}
  <div className="text-left">
    <div className="font-bold text-gray-700">Login as</div>
    <div className="font-bold text-blue-600">Super Admin</div>
  </div>
</div>



          <div className="sa-divider" />

          {/* Error */}
          {loginError && (
            <div className="sa-error">
              <AlertIcon />
              <span className="sa-error-text">{loginError}</span>
            </div>
          )}

          {/* Phone */}
          <div className="sa-field">
            <label className="sa-label">Phone Number</label>
            <div className="sa-input-wrap">
              <input
                type="text"
                value={credentials.phoneNumber}
                onChange={(e) => { setCredentials({ ...credentials, phoneNumber: e.target.value }); setLoginError(""); }}
                onKeyDown={onKey}
                placeholder="Enter phone number"
                className="sa-input"
              />
              <span className="sa-input-icon"><PhoneIcon /></span>
            </div>
          </div>

          {/* Password */}
          <div className="sa-field">
            <label className="sa-label">Password</label>
            <div className="sa-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => { setCredentials({ ...credentials, password: e.target.value }); setLoginError(""); }}
                onKeyDown={onKey}
                placeholder="Enter password"
                className="sa-input"
                style={{ paddingRight: "36px" }}
              />
              <span className="sa-input-icon"><LockIcon /></span>
              <button className="sa-eye" onClick={() => setShowPassword(p => !p)} tabIndex={-1} type="button">
                <EyeIcon off={showPassword} />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button className="sa-btn" onClick={handleLogin} disabled={loading}>
            {loading
              ? <><div className="sa-spinner" /> Signing in…</>
              : <>Sign In <ArrowIcon /></>
            }
          </button>

          {/* Footer */}
          {/* <div className="sa-footer">
            <p className="sa-footer-text">Not a super admin?</p>
            <button className="sa-footer-btn" onClick={() => navigate("/otherslogin")}>
              Sign in as staff →
            </button>
          </div> */}

        </div>
      </div>
    </>
  );
};

export default SuperAdminLogin;