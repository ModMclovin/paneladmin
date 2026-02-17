
import React, { useState, useEffect, useCallback } from "react";
const TOPBAR = {
  logoSrc:     "src/images/JeevanCare.png",   // ← change logo path here
  logoAlt:     "Jeevan Care",
  appTitle:    "Jeevan Care",
  appSubtitle: "Admin Portal",
  adminName:   "Admin",
  adminAvatar: null,                 // ← set "/assets/avatar.png" or null
};
// ════════════════════════════════════════════════════════════

/* ── Icons ── */
const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

/* ══════════════════════════════════════
   TOP BAR COMPONENT
══════════════════════════════════════ */
const TopBar = ({ onToggleSidebar, onLogout }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "60px",
      padding: "0 24px",
      background: "#ffffff",
      borderBottom: "1px solid #eef0f3",
      boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 20,
      fontFamily: "'DM Sans', 'Nunito', ui-sans-serif, system-ui, sans-serif",
    }}>

      {/* ── LEFT: hamburger + logo + brand ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

        {/* Hamburger */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSidebar(); }}
          style={{
            display: "flex", flexDirection: "column", justifyContent: "center",
            gap: "4px", background: "none", border: "none", cursor: "pointer",
            padding: "7px", borderRadius: "8px",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
          title="Toggle Sidebar"
        >
          <span style={{ display:"block", width:"18px", height:"1.8px", background:"#374151", borderRadius:"2px" }}/>
          <span style={{ display:"block", width:"12px", height:"1.8px", background:"#9ca3af", borderRadius:"2px" }}/>
          <span style={{ display:"block", width:"18px", height:"1.8px", background:"#374151", borderRadius:"2px" }}/>
        </button>

        <div style={{ width:"1px", height:"26px", background:"#e9ebee" }}/>

        {/* Logo */}
        <div style={{
          width: "34px", height: "34px", borderRadius: "9px",
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", flexShrink: 0,
          boxShadow: "0 2px 8px rgba(59,130,246,0.25)",
        }}>
          {TOPBAR.logoSrc ? (
            <img
              src={TOPBAR.logoSrc}
              alt={TOPBAR.logoAlt}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => {
                e.currentTarget.replaceWith(
                  Object.assign(document.createElement("span"), {
                    textContent: TOPBAR.appTitle.charAt(0),
                    style: "color:#fff;font-weight:700;font-size:15px",
                  })
                );
              }}
            />
          ) : (
            <span style={{ color:"#fff", fontWeight:700, fontSize:"15px" }}>
              {TOPBAR.appTitle.charAt(0)}
            </span>
          )}
        </div>

        {/* Brand text */}
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight:700, fontSize:"14.5px", color:"#111827", letterSpacing:"-0.2px" }}>
            {TOPBAR.appTitle}
          </div>
          <div style={{ fontWeight:400, fontSize:"10.5px", color:"#a8b0bd", marginTop:"1px", letterSpacing:"0.1px" }}>
            {TOPBAR.appSubtitle}
          </div>
        </div>
      </div>

      {/* ── RIGHT: date-time · bell · avatar · logout ── */}
      <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>

        {/* Date & Time */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", marginRight:"10px" }}>
          <span style={{ fontSize:"13px", fontWeight:600, color:"#374151" }}>{timeStr}</span>
          <span style={{ fontSize:"10px", color:"#b0b8c5", marginTop:"1px" }}>{dateStr}</span>
        </div>

        {/* Notification Bell */}
        <button style={{
          position:"relative", background:"none", border:"none",
          cursor:"pointer", padding:"8px", borderRadius:"9px",
          color:"#6b7280", display:"flex", alignItems:"center",
          transition:"background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
          title="Notifications"
        >
          <BellIcon />
          <span style={{
            position:"absolute", top:"7px", right:"7px",
            width:"6px", height:"6px",
            background:"#ef4444", borderRadius:"50%",
            border:"1.5px solid #fff",
          }}/>
        </button>

        <div style={{ width:"1px", height:"26px", background:"#e9ebee", margin:"0 4px" }}/>

        {/* Admin avatar + name */}
        <button style={{
          display:"flex", alignItems:"center", gap:"8px",
          background:"none", border:"none", cursor:"pointer",
          padding:"5px 10px 5px 5px", borderRadius:"10px",
          transition:"background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <div style={{
            width:"30px", height:"30px", borderRadius:"50%",
            overflow:"hidden",
            background:"linear-gradient(135deg, #1e40af, #60a5fa)",
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0,
            outline:"2px solid #dbeafe", outlineOffset:"1px",
          }}>
            {TOPBAR.adminAvatar ? (
              <img src={TOPBAR.adminAvatar} alt="Admin"
                style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            ) : (
              <span style={{ color:"#fff", fontWeight:700, fontSize:"12px" }}>
                {TOPBAR.adminName.charAt(0)}
              </span>
            )}
          </div>
          <div style={{ lineHeight:1.1, textAlign:"left" }}>
            <div style={{ fontSize:"12.5px", fontWeight:600, color:"#111827" }}>
              {TOPBAR.adminName}
            </div>
            <div style={{ fontSize:"10px", color:"#9ca3af", marginTop:"1px" }}>
              Administrator
            </div>
          </div>
          <span style={{ color:"#c4c9d4", marginLeft:"2px" }}><ChevronDown /></span>
        </button>

        <div style={{ width:"1px", height:"26px", background:"#e9ebee", margin:"0 4px" }}/>

        {/* ── Logout Button ── */}
        <button
          onClick={onLogout}
          style={{
            display:"flex", alignItems:"center", gap:"5px",
            background:"none", border:"1px solid #fee2e2",
            cursor:"pointer", padding:"5px 12px",
            borderRadius:"8px", color:"#dc2626",
            fontSize:"12px", fontWeight:600,
            fontFamily:"'DM Sans', ui-sans-serif, sans-serif",
            transition:"all 0.15s", marginLeft:"2px",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#dc2626";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#dc2626";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#dc2626";
            e.currentTarget.style.borderColor = "#fee2e2";
          }}
          title="Logout"
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;