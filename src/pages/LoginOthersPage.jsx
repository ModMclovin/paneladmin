// LoginOthersPage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

/* ── Inline styles ── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    display: flex;
    font-family: 'Outfit', ui-sans-serif, sans-serif;
    background: #f0f4ff;
  }

  /* ── Left panel ── */
  .login-left {
    display: none;
    flex: 1;
    background: linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 100%);
    position: relative;
    overflow: hidden;
    padding: 48px;
    flex-direction: column;
    justify-content: space-between;
  }
  @media (min-width: 900px) { .login-left { display: flex; } }

  .login-left::before {
    content: "";
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    top: -120px; right: -120px;
  }
  .login-left::after {
    content: "";
    position: absolute;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    bottom: -60px; left: -60px;
  }

  .brand-logo {
    display: flex; align-items: center; gap: 12px; position: relative; z-index: 1;
  }
  .brand-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
  }
  .brand-name {
    font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.3px;
  }
  .brand-tagline { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 1px; }

  .left-content { position: relative; z-index: 1; }
  .left-headline {
    font-size: 34px; font-weight: 700; color: #fff;
    line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 14px;
  }
  .left-headline span { color: #93c5fd; }
  .left-sub { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.6; max-width: 340px; }

  .feature-list { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; position: relative; z-index: 1; }
  .feature-item {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 10px 14px;
    backdrop-filter: blur(4px);
  }
  .feature-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #93c5fd; flex-shrink: 0;
  }
  .feature-text { font-size: 13px; color: rgba(255,255,255,0.8); }

  /* ── Right panel ── */
  .login-right {
    flex: 0 0 100%;
    display: flex; align-items: center; justify-content: center;
    padding: 24px 20px;
  }
  @media (min-width: 900px) { .login-right { flex: 0 0 440px; } }

  .login-card {
    width: 100%; max-width: 400px;
    background: #fff; border-radius: 20px;
    padding: 36px 32px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 48px rgba(0,0,0,0.1);
    animation: slideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-header { margin-bottom: 28px; }
  .card-eyebrow {
    font-size: 11px; font-weight: 600; color: #2563eb;
    letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 6px;
  }
  .card-title {
    font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;
  }
  .card-sub { font-size: 13px; color: "#6b7280"; margin-top: 4px; }

  /* ── Fields ── */
  .field { margin-bottom: 14px; }
  .field-label {
    display: block; font-size: 12px; font-weight: 500;
    color: #374151; margin-bottom: 5px;
  }
  .field-input {
    width: 100%; height: 40px;
    padding: 0 12px; font-size: 13.5px;
    font-family: 'Outfit', ui-sans-serif, sans-serif;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    outline: none; background: #fafafa; color: #111827;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  .field-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    background: #fff;
  }
  .field-input.error { border-color: #fca5a5; background: #fff7f7; }
  .field-input.error:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
  .field-error { font-size: 11px; color: #ef4444; margin-top: 3px; padding-left: 2px; }

  select.field-input { cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
    padding-right: 32px;
  }

  /* ── Error banner ── */
  .error-banner {
    background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;
    padding: 10px 12px; margin-bottom: 14px;
    display: flex; align-items: flex-start; gap: 8px;
  }
  .error-banner-text { font-size: 12.5px; color: #dc2626; }

  /* ── Submit button ── */
  .btn-submit {
    width: 100%; height: 42px;
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    color: #fff; border: none; border-radius: 10px;
    font-size: 14px; font-weight: 600;
    font-family: 'Outfit', ui-sans-serif, sans-serif;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 2px 8px rgba(37,99,235,0.35);
    margin-top: 6px;
  }
  .btn-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    box-shadow: 0 4px 16px rgba(37,99,235,0.4);
    transform: translateY(-1px);
  }
  .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

  /* ── Footer ── */
  .card-footer { text-align: center; margin-top: 18px; }
  .card-footer p { font-size: 12.5px; color: #6b7280; }
  .card-footer button {
    background: none; border: none; color: #2563eb; font-weight: 600;
    font-size: 12.5px; cursor: pointer; font-family: 'Outfit', ui-sans-serif, sans-serif;
    padding: 0; transition: color 0.15s;
  }
  .card-footer button:hover { color: #1d4ed8; text-decoration: underline; }

  /* ── Spinner ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    animation: spin 0.7s linear infinite; flex-shrink: 0;
  }

  /* ── Mobile brand ── */
  .mobile-brand {
    display: flex; flex-direction: column; align-items: center; margin-bottom: 24px;
  }
  @media (min-width: 900px) { .mobile-brand { display: none; } }
  .mobile-brand-icon {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35); margin-bottom: 10px;
  }
  .mobile-brand-name { font-size: 18px; font-weight: 700; color: #0f172a; }
  .mobile-brand-sub { font-size: 12px; color: #9ca3af; margin-top: 2px; }
`;

/* ── SVG icons ── */
const HospitalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const LoginIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ═══════════════════════════════════════
   COMPONENT
═══════════════════════════════════════ */
const LoginOthersPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("http://192.168.18.221:5237/getAllHospital");
        const result = await response.json();
        if (result.isSuccess) setHospitals(result.data);
        else setError("Failed to load hospitals");
      } catch (err) {
        console.error(err);
        setError("Error fetching hospitals");
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  const handleKeyPress = (e) => { if (e.key === "Enter") handleLogin(); };

  const handleLogin = async () => {
    setError("");
    if (!selectedHospital) return setError("Please select a hospital");
    if (!username.trim())  return setError("Please enter your phone number");
    if (!password.trim())  return setError("Please enter your password");
    setLoading(true);
    try {
      const response = await fetch("http://192.168.18.221:5237/SignInUser/SpecifiedRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "X-Tenant-Id": selectedHospital,
        },
        body: JSON.stringify({ phoneNumber: username, password }),
      });
      const result = await response.json();
      if (result.isSuccess) {
        const { token, role } = result.data;
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("tenantId", selectedHospital, { expires: 1 });
        Cookies.set("role", role, { expires: 1 });
        navigate(role === "Receptionist" ? "/reception" : "/dashboard");
      } else {
        setError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root items-center justify-center">

     
        {/* ── RIGHT PANEL ── */}
        <div className="login-right">
          <div className="login-card">

            {/* Mobile brand (hidden on desktop) */}
            <div className="mobile-brand">
              <div className="mobile-brand-icon"><HospitalIcon /></div>
              <div className="mobile-brand-name">Jeevan Care</div>
              <div className="mobile-brand-sub">Hospital Management System</div>
            </div>

            {/* Card header */}
           <div className="card-header flex items-center gap-4">
  {/* Image Section */}
  <div className="card-eyebrow">
    <img 
      src="src/images/JeevanCare.png" // your image src
      alt="Hospital"
      className="w-20 h-15" // adjust size
    />
  </div>

  {/* Text Section */}
  <div className="card-text flex flex-col">
    <div className="card-title text-lg font-semibold">
      Welcome back
    </div>
    <div
      className="card-sub"
      style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}
    >
      Sign in to continue to your dashboard
    </div>
  </div>
</div>

            {/* Error banner */}
            {error && (
              <div className="error-banner">
                <AlertIcon />
                <span className="error-banner-text">{error}</span>
              </div>
            )}

            {/* Hospital */}
            <div className="field">
              <label className="field-label">Select Hospital</label>
              <select
                value={selectedHospital}
                onChange={(e) => { setSelectedHospital(e.target.value); setError(""); }}
                disabled={loadingHospitals}
                className={`field-input${!selectedHospital && error ? " error" : ""}`}
              >
                <option value="">
                  {loadingHospitals ? "Loading hospitals…" : "— Choose a hospital —"}
                </option>
                {hospitals.map((h) => (
                  <option key={h.tenantId} value={h.tenantId}>{h.name}</option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div className="field">
              <label className="field-label">Phone Number</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                onKeyDown={handleKeyPress}
                placeholder="Enter your phone number"
                className="field-input"
              />
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter your password"
                  className="field-input"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: "absolute", right: "10px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "#9ca3af",
                    display: "flex", alignItems: "center", padding: 0,
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="btn-submit" onClick={handleLogin} disabled={loading}>
              {loading ? <><div className="spinner" />Signing in…</> : <><LoginIcon />Sign In</>}
            </button>

            {/* Footer */}
            <div className="card-footer">
              <p>
               
                <button onClick={() => navigate("/superAdminLogin")}>Login as Super Admin</button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default LoginOthersPage;