// DashboardPage.js
import React, { useState, useEffect } from "react";
import { fetchAPI } from "../../api/fetchApi";

const font = "'DM Sans', ui-sans-serif, sans-serif";

// ── SVG Icons ─────────────────────────────────────────────────
const Icons = {
  users:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  check:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  clock:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  xCircle:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  rupee:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="5" x2="18" y2="5"/><line x1="6" y1="10" x2="18" y2="10"/><path d="M6 10l7 9"/><path d="M10 5a4 4 0 0 1 0 5H6"/></svg>,
  bank:         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  wallet:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1 0-4h14v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><circle cx="16" cy="14" r="1" fill="currentColor"/></svg>,
  hourglass:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>,
  calDay:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg>,
  calMonth:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  user:         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  clipboard:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  activity:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  expire:       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  trendDown:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
};

// ── Icon wrapper (colored) ─────────────────────────────────────
const IconBox = ({ icon, bg, color }) => (
  <div style={{
    width: "40px", height: "40px", borderRadius: "12px", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, color,
  }}>
    {icon}
  </div>
);

// ── Animated counter (integers) ───────────────────────────────
const useCountUp = (target, duration = 1100) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) { setCount(0); return; }
    let cur = 0;
    const step = Math.ceil(target / (duration / 16));
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(cur);
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return count;
};

// ── Animated counter (decimals) ───────────────────────────────
const useCountUpFloat = (target, duration = 1100) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) { setCount(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
};

// ── Donut Chart ────────────────────────────────────────────────
const DonutChart = ({ data, size = 170 }) => {
  const radius = 65, stroke = 20, cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.value, 0);
  const [hovered, setHovered] = useState(null);
  let offset = 0;
  const slices = data.map((d) => {
    const pct = total ? d.value / total : 0;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const rotate = (offset / (total || 1)) * 360 - 90;
    offset += d.value;
    return { ...d, dash, gap, rotate };
  });
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={radius} fill="none"
            stroke={s.color}
            strokeWidth={hovered === i ? stroke + 4 : stroke}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={0} strokeLinecap="butt"
            style={{
              transform: `rotate(${s.rotate}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: "stroke-width 0.2s, opacity 0.2s",
              opacity: hovered !== null && hovered !== i ? 0.4 : 1,
              cursor: "pointer",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        <text x={cx} y={cy - 7} textAnchor="middle"
          style={{ fontSize: "20px", fontWeight: 700, fill: "#111827", fontFamily: font }}>
          {hovered !== null ? slices[hovered].value : total}
        </text>
        <text x={cx} y={cy + 13} textAnchor="middle"
          style={{ fontSize: "9.5px", fill: "#6b7280", fontFamily: font }}>
          {hovered !== null ? slices[hovered].label : "Total"}
        </text>
      </svg>
    </div>
  );
};

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ label, value, prefix = "", suffix = "", icon, color, bg, border, delay = 0, isFloat = false }) => {
  const intVal   = useCountUp(isFloat ? 0 : value, 1000 + delay);
  const floatVal = useCountUpFloat(isFloat ? value : 0, 1000 + delay);
  const display  = isFloat
    ? `${prefix}${floatVal.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}${suffix}`
    : `${prefix}${intVal}${suffix}`;
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background: "#fff", border: `1px solid ${border}`, borderRadius: "14px",
      padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s",
      flex: "1 1 150px", minWidth: 0, cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px ${color}33`; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <IconBox icon={icon} bg={bg} color={color} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: "10.5px", fontWeight: 500, color: "#6b7280",
          letterSpacing: "0.4px", textTransform: "uppercase", fontFamily: font, marginBottom: "3px" }}>
          {label}
        </div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827", fontFamily: font, lineHeight: 1 }}>
          {display}
        </div>
      </div>
      <div style={{ width: "3px", height: "28px", borderRadius: "4px", background: color, flexShrink: 0 }} />
    </div>
  );
};

// ── Section Label ──────────────────────────────────────────────
const SectionLabel = ({ title }) => (
  <div style={{ fontSize: "16px", fontWeight: 600, color: "#1d4ed8", letterSpacing: "0.6px",
    textTransform: "uppercase", marginBottom: "14px", fontFamily: font }}>
    {title}
  </div>
);

// ── Section Heading ────────────────────────────────────────────
const SectionHeading = ({ title, subtitle }) => (
  <div style={{ marginBottom: "12px" }}>
    <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: font }}>{title}</div>
    <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px", fontFamily: font }}>{subtitle}</div>
  </div>
);

// ── Progress Bar ───────────────────────────────────────────────
const ProgressRow = ({ label, value, total, color, prefix = "" }) => {
  const [w, setW] = useState(0);
  const pct = total ? Math.round((value / total) * 100) : 0;
  useEffect(() => { const t = setTimeout(() => setW(pct), 300); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 500, color: "#6b7280", fontFamily: font }}>{label}</span>
        <span style={{ fontSize: "11px", fontWeight: 600, color, fontFamily: font }}>
          {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}
          <span style={{ color: "#c4c9d4", fontWeight: 400 }}> ({pct}%)</span>
        </span>
      </div>
      <div style={{ height: "5px", borderRadius: "10px", background: "#e5e7eb", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: "10px", background: color,
          width: `${w}%`, transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </div>
    </div>
  );
};

// ── Info Row ───────────────────────────────────────────────────
const InfoRow = ({ label, value, color = "#374151" }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
    <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: font }}>{label}</span>
    <span style={{ fontSize: "11.5px", fontWeight: 600, color, fontFamily: font }}>{value}</span>
  </div>
);

// ── Rate Footer ───────────────────────────────────────────────
const RateFooter = ({ items }) => (
  <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #f3f4f6",
    display: "flex", justifyContent: "space-around" }}>
    {items.map(r => (
      <div key={r.label} style={{ textAlign: "center" }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: r.color, fontFamily: font }}>{r.val}</div>
        <div style={{ fontSize: "9.5px", color: "#6b7280", marginTop: "1px", fontFamily: font }}>{r.label}</div>
      </div>
    ))}
  </div>
);

// ── Donut Legend ───────────────────────────────────────────────
const DonutLegend = ({ data }) => (
  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "7px" }}>
    {data.map(d => (
      <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: d.color }} />
          <span style={{ fontSize: "11.5px", color: "#6b7280", fontFamily: font }}>{d.label}</span>
        </div>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: font }}>{d.value}</span>
      </div>
    ))}
  </div>
);

// ── Card wrapper ───────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: "14px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    padding: "16px 18px",
    ...style,
  }}>
    {children}
  </div>
);

// ══════════════════════════════════════════════════════════════
//  DASHBOARD PAGE
// ══════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const [helperStats, setHelperStats] = useState({
    TotalHelper: 0, ApprovedHelper: 0, RejectedHelper: 0, PendingHelper: 0,
  });
  const [rev, setRev] = useState({
    TotalRevenue: 0, TotalCommission: 0, TotalPaidToHelpers: 0, PendingPayout: 0,
    PaidHelpers: 0, UnpaidHelpers: 0, PaidPercentage: 0,
    TotalMinutesWorked: 0, TotalHoursWorked: 0, AverageMinutesPerHelper: 0,
    AverageHelperEarning: 0, HighestHelperEarning: 0, LowestHelperEarning: 0,
    CommissionPercentage: 0, PayoutPercentage: 0,
    TodayRevenue: 0, ThisMonthRevenue: 0,
  });
  const [booking, setBooking] = useState({
    TotalBookings: 0, TodayBookings: 0, MonthlyBookings: 0,
    ApprovedBookings: 0, ExpiredBookings: 0, RejectedBookings: 0, PendingBookings: 0,
    ActiveBookingsNow: 0,
    UniquePatients: 0, RepeatPatients: 0, PatientRetentionRate: 0,
    ActiveHelpers: 0, IdleHelpers: 0,
    TotalServiceMinutes: 0, TotalServiceHours: 0,
    AverageBookingMinutes: 0, LongestBookingMinutes: 0, ShortestBookingMinutes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [h, r, b] = await Promise.all([
          fetchAPI("/getHelperStatistics"),
          fetchAPI("/getHelperRevenueStatistics"),
          fetchAPI("/getBookingStatistics"),
        ]);
        const hd = h?.data ?? {};
        setHelperStats({
          TotalHelper:    hd.totalHelper    ?? 0,
          ApprovedHelper: hd.approvedHelper ?? 0,
          RejectedHelper: hd.rejectedHelper ?? 0,
          PendingHelper:  hd.pendingHelper  ?? 0,
        });
        const rd = r?.data ?? {};
        setRev({
          TotalRevenue:            rd.totalRevenue            ?? 0,
          TotalCommission:         rd.totalCommission         ?? 0,
          TotalPaidToHelpers:      rd.totalPaidToHelpers      ?? 0,
          PendingPayout:           rd.pendingPayout           ?? 0,
          PaidHelpers:             rd.paidHelpers             ?? 0,
          UnpaidHelpers:           rd.unpaidHelpers           ?? 0,
          PaidPercentage:          rd.paidPercentage          ?? 0,
          TotalMinutesWorked:      rd.totalMinutesWorked      ?? 0,
          TotalHoursWorked:        rd.totalHoursWorked        ?? 0,
          AverageMinutesPerHelper: rd.averageMinutesPerHelper ?? 0,
          AverageHelperEarning:    rd.averageHelperEarning    ?? 0,
          HighestHelperEarning:    rd.highestHelperEarning    ?? 0,
          LowestHelperEarning:     rd.lowestHelperEarning     ?? 0,
          CommissionPercentage:    rd.commissionPercentage    ?? 0,
          PayoutPercentage:        rd.payoutPercentage        ?? 0,
          TodayRevenue:            rd.todayRevenue            ?? 0,
          ThisMonthRevenue:        rd.thisMonthRevenue        ?? 0,
        });
        const bd = b?.data ?? {};
        setBooking({
          TotalBookings:          bd.totalBookings          ?? 0,
          TodayBookings:          bd.todayBookings          ?? 0,
          MonthlyBookings:        bd.monthlyBookings        ?? 0,
          ApprovedBookings:       bd.approvedBookings       ?? 0,
          ExpiredBookings:        bd.expiredBookings        ?? 0,
          RejectedBookings:       bd.rejectedBookings       ?? 0,
          PendingBookings:        bd.pendingBookings        ?? 0,
          ActiveBookingsNow:      bd.activeBookingsNow      ?? 0,
          UniquePatients:         bd.uniquePatients         ?? 0,
          RepeatPatients:         bd.repeatPatients         ?? 0,
          PatientRetentionRate:   bd.patientRetentionRate   ?? 0,
          ActiveHelpers:          bd.activeHelpers          ?? 0,
          IdleHelpers:            bd.idleHelpers            ?? 0,
          TotalServiceMinutes:    bd.totalServiceMinutes    ?? 0,
          TotalServiceHours:      bd.totalServiceHours      ?? 0,
          AverageBookingMinutes:  bd.averageBookingMinutes  ?? 0,
          LongestBookingMinutes:  bd.longestBookingMinutes  ?? 0,
          ShortestBookingMinutes: bd.shortestBookingMinutes ?? 0,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      height: "300px", color: "#9ca3af", fontSize: "14px", fontFamily: font }}>
      Loading dashboard…
    </div>
  );

  const helperDonut = [
    { label: "Approved", value: helperStats.ApprovedHelper, color: "#10b981" },
    { label: "Pending",  value: helperStats.PendingHelper,  color: "#0b90f5" },
    { label: "Rejected", value: helperStats.RejectedHelper, color: "#ef4444" },
  ];
  const payoutDonut = [
    { label: "Paid",   value: rev.PaidHelpers,  color: "#10b981" },
    { label: "Unpaid", value: rev.UnpaidHelpers, color: "#f50b0b" },
  ];
  const bookingDonut = [
    { label: "Approved", value: booking.ApprovedBookings, color: "#10b981" },
    { label: "Pending",  value: booking.PendingBookings,  color: "#0b90f5" },
    { label: "Expired",  value: booking.ExpiredBookings,  color: "#f59e0b" },
    { label: "Rejected", value: booking.RejectedBookings, color: "#ef4444" },
  ];
  const helperActivityDonut = [
    { label: "Active", value: booking.ActiveHelpers, color: "#10b981" },
    { label: "Idle",   value: booking.IdleHelpers,   color: "#f59e0b" },
  ];

  return (
    <div style={{ fontFamily: font, maxWidth: "1280px" }}>

      {/* ══════════════════════════════════
          SECTION 1 — Helper Overview
      ══════════════════════════════════ */}

      {/* ══════════════════════════════════
          SECTION 2 — Revenue & Commission
      ══════════════════════════════════ */}
      <SectionLabel title="Revenue & Commission" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        <StatCard label="Total Revenue"    value={rev.TotalRevenue}       prefix="₹" icon={Icons.rupee}    color="#3b82f6" bg="#eff6ff" border="#dbeafe" delay={0}   isFloat />
        <StatCard label="Total Commission" value={rev.TotalCommission}    prefix="₹" icon={Icons.bank}     color="#6366f1" bg="#eef2ff" border="#e0e7ff" delay={70}  isFloat />
        <StatCard label="Paid to Helpers"  value={rev.TotalPaidToHelpers} prefix="₹" icon={Icons.wallet}   color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={140} isFloat />
        <StatCard label="Pending Payout"   value={rev.PendingPayout}      prefix="₹" icon={Icons.hourglass} color="#f59e0b" bg="#fffbeb" border="#fde68a" delay={210} isFloat />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <StatCard label="Today's Revenue"    value={rev.TodayRevenue}     prefix="₹" icon={Icons.calDay}   color="#0ea5e9" bg="#f0f9ff" border="#bae6fd" delay={0}  isFloat />
        <StatCard label="This Month Revenue" value={rev.ThisMonthRevenue} prefix="₹" icon={Icons.calMonth} color="#8b5cf6" bg="#f5f3ff" border="#ddd6fe" delay={70} isFloat />
        <StatCard label="Paid Helpers"       value={rev.PaidHelpers}               icon={Icons.user}     color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={140} />
        <StatCard label="Unpaid Helpers"     value={rev.UnpaidHelpers}             icon={Icons.user}     color="#f59e0b" bg="#fffbeb" border="#fde68a" delay={210} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: "0 0 auto", minWidth: "210px" }}>
          <SectionHeading title="Payout Distribution" subtitle="Paid vs Unpaid helpers" />
          <DonutChart data={payoutDonut} size={160} />
          <DonutLegend data={payoutDonut} />
        </Card>
        <Card style={{ flex: "1 1 220px", minWidth: "200px" }}>
          <SectionHeading title="Revenue Breakdown" subtitle="Share of total revenue" />
          <ProgressRow label="Paid to Helpers" value={rev.TotalPaidToHelpers} total={rev.TotalRevenue} color="#10b981" prefix="₹" />
          <ProgressRow label="Commission"       value={rev.TotalCommission}    total={rev.TotalRevenue} color="#6366f1" prefix="₹" />
          <ProgressRow label="Pending Payout"  value={rev.PendingPayout}       total={rev.TotalRevenue} color="#f59e0b" prefix="₹" />
          <RateFooter items={[
            { label: "Commission %", val: `${rev.CommissionPercentage.toFixed(1)}%`, color: "#6366f1" },
            { label: "Payout %",     val: `${rev.PayoutPercentage.toFixed(1)}%`,     color: "#10b981" },
            { label: "Paid %",       val: `${rev.PaidPercentage.toFixed(1)}%`,       color: "#3b82f6" },
          ]} />
        </Card>
        <Card style={{ flex: "1 1 200px", minWidth: "190px" }}>
          <SectionHeading title="Performance & Time" subtitle="Earning & service metrics" />
          <InfoRow label="Avg. Earning"    value={`₹${rev.AverageHelperEarning.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} color="#3b82f6" />
          <InfoRow label="Highest Earning" value={`₹${rev.HighestHelperEarning.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} color="#10b981" />
          <InfoRow label="Lowest Earning"  value={`₹${rev.LowestHelperEarning.toLocaleString("en-IN",  { maximumFractionDigits: 0 })}`} color="#ef4444" />
          <InfoRow label="Total Hours"     value={`${rev.TotalHoursWorked.toFixed(1)} hrs`}             color="#6366f1" />
          <InfoRow label="Total Minutes"   value={`${rev.TotalMinutesWorked.toLocaleString()} min`}     color="#6366f1" />
          <InfoRow label="Avg. Min/Helper" value={`${rev.AverageMinutesPerHelper.toFixed(1)} min`}      color="#f59e0b" />
        </Card>
      </div>

      {/* ══════════════════════════════════
          SECTION 3 — Booking Statistics
      ══════════════════════════════════ */}
      <SectionLabel title="Booking Statistics" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        <StatCard label="Total Bookings" value={booking.TotalBookings}     icon={Icons.clipboard} color="#3b82f6" bg="#eff6ff" border="#dbeafe" delay={0}   />
        <StatCard label="Today"          value={booking.TodayBookings}     icon={Icons.calDay}    color="#0ea5e9" bg="#f0f9ff" border="#bae6fd" delay={70}  />
        <StatCard label="This Month"     value={booking.MonthlyBookings}   icon={Icons.calMonth}  color="#8b5cf6" bg="#f5f3ff" border="#ddd6fe" delay={140} />
        <StatCard label="Active Now"     value={booking.ActiveBookingsNow} icon={Icons.activity}  color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={210} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <StatCard label="Approved" value={booking.ApprovedBookings} icon={Icons.check}    color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={0}   />
        <StatCard label="Pending"  value={booking.PendingBookings}  icon={Icons.clock}    color="#0b90f5" bg="#eff6ff" border="#bfdbfe" delay={70}  />
        <StatCard label="Expired"  value={booking.ExpiredBookings}  icon={Icons.expire}   color="#f59e0b" bg="#fffbeb" border="#fde68a" delay={140} />
        <StatCard label="Rejected" value={booking.RejectedBookings} icon={Icons.xCircle}  color="#ef4444" bg="#fef2f2" border="#fecaca" delay={210} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: "0 0 auto", minWidth: "210px" }}>
          <SectionHeading title="Booking Status" subtitle="Approved / Pending / Expired / Rejected" />
          <DonutChart data={bookingDonut} size={160} />
          <DonutLegend data={bookingDonut} />
        </Card>
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: "0 0 auto", minWidth: "210px" }}>
          <SectionHeading title="Helper Activity" subtitle="Active vs Idle helpers" />
          <DonutChart data={helperActivityDonut} size={160} />
          <DonutLegend data={helperActivityDonut} />
        </Card>
        <Card style={{ flex: "1 1 200px", minWidth: "190px" }}>
          <SectionHeading title="Patient Insights" subtitle="Unique, repeat & retention" />
          <InfoRow label="Unique Patients"   value={booking.UniquePatients}                        color="#3b82f6" />
          <InfoRow label="Repeat Patients"   value={booking.RepeatPatients}                        color="#8b5cf6" />
          <InfoRow label="Retention Rate"    value={`${booking.PatientRetentionRate.toFixed(1)}%`} color="#10b981" />
          <InfoRow label="Active Helpers"    value={booking.ActiveHelpers}                         color="#0b90f5" />
          <InfoRow label="Idle Helpers"      value={booking.IdleHelpers}                           color="#f59e0b" />
          <InfoRow label="Expired Bookings"  value={booking.ExpiredBookings}                       color="#f59e0b" />
          <InfoRow label="Rejected Bookings" value={booking.RejectedBookings}                      color="#ef4444" />
        </Card>
        <Card style={{ flex: "1 1 200px", minWidth: "190px" }}>
          <SectionHeading title="Service Duration" subtitle="Time & booking duration metrics" />
          <InfoRow label="Total Service Hrs"  value={`${booking.TotalServiceHours.toFixed(1)} hrs`}         color="#6366f1" />
          <InfoRow label="Total Service Min"  value={`${booking.TotalServiceMinutes.toLocaleString()} min`} color="#6366f1" />
          <InfoRow label="Avg. Booking"       value={`${booking.AverageBookingMinutes.toFixed(1)} min`}     color="#0ea5e9" />
          <InfoRow label="Longest Booking"    value={`${booking.LongestBookingMinutes} min`}                color="#10b981" />
          <InfoRow label="Shortest Booking"   value={`${booking.ShortestBookingMinutes} min`}               color="#f59e0b" />
          <ProgressRow label="Booking Approval"
            value={booking.ApprovedBookings} total={booking.TotalBookings} color="#10b981" />
        </Card>
      </div>
      <SectionLabel title="Helper Overview" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <StatCard label="Total Helpers" value={helperStats.TotalHelper}    icon={Icons.users}   color="#3b82f6" bg="#eff6ff" border="#dbeafe" delay={0}   />
        <StatCard label="Approved"      value={helperStats.ApprovedHelper} icon={Icons.check}   color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={70}  />
        <StatCard label="Pending"       value={helperStats.PendingHelper}  icon={Icons.clock}   color="#0b90f5" bg="#eff6ff" border="#bfdbfe" delay={140} />
        <StatCard label="Rejected"      value={helperStats.RejectedHelper} icon={Icons.xCircle} color="#ef4444" bg="#fef2f2" border="#fecaca" delay={210} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: "0 0 auto", minWidth: "210px" }}>
          <SectionHeading title="Status Distribution" subtitle="Approval breakdown" />
          <DonutChart data={helperDonut} size={160} />
          <DonutLegend data={helperDonut} />
        </Card>
        <Card style={{ flex: "1 1 240px", minWidth: "220px" }}>
          <SectionHeading title="Registration Breakdown" subtitle="Share of each status out of total" />
          <ProgressRow label="Approved" value={helperStats.ApprovedHelper} total={helperStats.TotalHelper} color="#10b981" />
          <ProgressRow label="Pending"  value={helperStats.PendingHelper}  total={helperStats.TotalHelper} color="#0b90f5" />
          <ProgressRow label="Rejected" value={helperStats.RejectedHelper} total={helperStats.TotalHelper} color="#ef4444" />
          <RateFooter items={[
            { label: "Approval Rate",  val: `${helperStats.TotalHelper ? Math.round((helperStats.ApprovedHelper / helperStats.TotalHelper) * 100) : 0}%`, color: "#10b981" },
            { label: "Pending Rate",   val: `${helperStats.TotalHelper ? Math.round((helperStats.PendingHelper  / helperStats.TotalHelper) * 100) : 0}%`, color: "#0b90f5" },
            { label: "Rejection Rate", val: `${helperStats.TotalHelper ? Math.round((helperStats.RejectedHelper / helperStats.TotalHelper) * 100) : 0}%`, color: "#ef4444" },
          ]} />
        </Card>
      </div>

    </div>
  );
}