// DashboardPage.js
import React, { useState, useEffect } from "react";
import { fetchAPI } from "../../api/fetchApi";

const font = "'DM Sans', ui-sans-serif, sans-serif";

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
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
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
          style={{ fontSize: "9.5px", fill: "#9ca3af", fontFamily: font }}>
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
      background: "#fff", border: `1px solid ${border}`, borderRadius: "12px",
      padding: "13px 16px", display: "flex", alignItems: "center", gap: "11px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 2px 10px rgba(0,0,0,0.04)",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s",
      flex: "1 1 150px", minWidth: 0, cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 18px ${color}22`; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 2px 10px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: "17px" }}>{icon}</span>
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: "10px", fontWeight: 500, color: "#b0b8c5",
          letterSpacing: "0.4px", textTransform: "uppercase", fontFamily: font, marginBottom: "2px" }}>
          {label}
        </div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#1f2937", fontFamily: font, lineHeight: 1 }}>
          {display}
        </div>
      </div>
      <div style={{ width: "2.5px", height: "28px", borderRadius: "4px", background: color, flexShrink: 0 }} />
    </div>
  );
};

// ── Section Label ──────────────────────────────────────────────
const SectionLabel = ({ title }) => (
  <div style={{ fontSize: "15px", fontWeight: 600, color: "#0091ff", letterSpacing: "0.6px",
    textTransform: "uppercase", marginBottom: "10px", fontFamily: font }}>
    {title}
  </div>
);

// ── Section Heading (inside card) ─────────────────────────────
const SectionHeading = ({ title, subtitle }) => (
  <div style={{ marginBottom: "11px" }}>
    <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#374151", fontFamily: font }}>{title}</div>
    <div style={{ fontSize: "10.5px", color: "#b0b8c5", marginTop: "1px", fontFamily: font }}>{subtitle}</div>
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
      <div style={{ height: "5px", borderRadius: "10px", background: "#f1f5f9", overflow: "hidden" }}>
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

// ── Rate Badge (% footer) ──────────────────────────────────────
const RateFooter = ({ items }) => (
  <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #f3f4f6",
    display: "flex", justifyContent: "space-around" }}>
    {items.map(r => (
      <div key={r.label} style={{ textAlign: "center" }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: r.color, fontFamily: font }}>{r.val}</div>
        <div style={{ fontSize: "9.5px", color: "#b0b8c5", marginTop: "1px", fontFamily: font }}>{r.label}</div>
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
    background: "#fff", borderRadius: "12px",
    border: "1px solid #f0f2f5",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 2px 10px rgba(0,0,0,0.04)",
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

  // Donut data
  const helperDonut = [
    { label: "Approved", value: helperStats.ApprovedHelper, color: "#10b981" },
    { label: "Pending",  value: helperStats.PendingHelper,  color: "#0b90f5" },
    { label: "Rejected", value: helperStats.RejectedHelper, color: "#ef4444" },
  ];
  const payoutDonut = [
    { label: "Paid",   value: rev.PaidHelpers,   color: "#10b981" },
    { label: "Unpaid", value: rev.UnpaidHelpers,  color: "#f50b0b" },
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

        <SectionLabel title="Revenue & Commission" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        <StatCard label="Total Revenue"    value={rev.TotalRevenue}       prefix="₹" icon="💰" color="#3b82f6" bg="#eff6ff" border="#dbeafe" delay={0}   isFloat />
        <StatCard label="Total Commission" value={rev.TotalCommission}    prefix="₹" icon="🏦" color="#6366f1" bg="#eef2ff" border="#e0e7ff" delay={70}  isFloat />
        <StatCard label="Paid to Helpers"  value={rev.TotalPaidToHelpers} prefix="₹" icon="✅" color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={140} isFloat />
        <StatCard label="Pending Payout"   value={rev.PendingPayout}      prefix="₹" icon="⏳" color="#f59e0b" bg="#fffbeb" border="#fde68a" delay={210} isFloat />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <StatCard label="Today's Revenue"    value={rev.TodayRevenue}     prefix="₹" icon="📅" color="#0ea5e9" bg="#f0f9ff" border="#bae6fd" delay={0}  isFloat />
        <StatCard label="This Month Revenue" value={rev.ThisMonthRevenue} prefix="₹" icon="📆" color="#8b5cf6" bg="#f5f3ff" border="#ddd6fe" delay={70} isFloat />
        <StatCard label="Paid Helpers"       value={rev.PaidHelpers}      icon="👤" color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={140} />
        <StatCard label="Unpaid Helpers"     value={rev.UnpaidHelpers}    icon="👤" color="#f59e0b" bg="#fffbeb" border="#fde68a" delay={210} />
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
          <InfoRow label="Avg. Earning"      value={`₹${rev.AverageHelperEarning.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} color="#3b82f6" />
          <InfoRow label="Highest Earning"   value={`₹${rev.HighestHelperEarning.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} color="#10b981" />
          <InfoRow label="Lowest Earning"    value={`₹${rev.LowestHelperEarning.toLocaleString("en-IN",  { maximumFractionDigits: 0 })}`} color="#ef4444" />
          <InfoRow label="Total Hours"       value={`${rev.TotalHoursWorked.toFixed(1)} hrs`}              color="#6366f1" />
          <InfoRow label="Total Minutes"     value={`${rev.TotalMinutesWorked.toLocaleString()} min`}      color="#6366f1" />
          <InfoRow label="Avg. Min/Helper"   value={`${rev.AverageMinutesPerHelper.toFixed(1)} min`}       color="#f59e0b" />
        </Card>
      </div>


 <SectionLabel title="Booking Statistics" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        <StatCard label="Total Bookings"   value={booking.TotalBookings}     icon="📋" color="#3b82f6" bg="#eff6ff" border="#dbeafe" delay={0}   />
        <StatCard label="Today"            value={booking.TodayBookings}     icon="📅" color="#0ea5e9" bg="#f0f9ff" border="#bae6fd" delay={70}  />
        <StatCard label="This Month"       value={booking.MonthlyBookings}   icon="📆" color="#8b5cf6" bg="#f5f3ff" border="#ddd6fe" delay={140} />
        <StatCard label="Active Now"       value={booking.ActiveBookingsNow} icon="🟢" color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={210} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <StatCard label="Approved"   value={booking.ApprovedBookings}  icon="✅" color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={0}   />
        <StatCard label="Pending"    value={booking.PendingBookings}   icon="⏳" color="#0b90f5" bg="#eff6ff" border="#bfdbfe" delay={70}  />
        <StatCard label="Expired"    value={booking.ExpiredBookings}   icon="⌛" color="#f59e0b" bg="#fffbeb" border="#fde68a" delay={140} />
        <StatCard label="Rejected"   value={booking.RejectedBookings}  icon="❌" color="#ef4444" bg="#fef2f2" border="#fecaca" delay={210} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>

        {/* Booking status donut */}
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: "0 0 auto", minWidth: "210px" }}>
          <SectionHeading title="Booking Status" subtitle="Approved / Pending / Expired / Rejected" />
          <DonutChart data={bookingDonut} size={160} />
          <DonutLegend data={bookingDonut} />
        </Card>

        {/* Helper activity donut */}
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flex: "0 0 auto", minWidth: "210px" }}>
          <SectionHeading title="Helper Activity" subtitle="Active vs Idle helpers" />
          <DonutChart data={helperActivityDonut} size={160} />
          <DonutLegend data={helperActivityDonut} />
        </Card>

        {/* Patient stats */}
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

        {/* Service time stats */}
        <Card style={{ flex: "1 1 200px", minWidth: "190px" }}>
          <SectionHeading title="Service Duration" subtitle="Time & booking duration metrics" />
          <InfoRow label="Total Service Hrs"   value={`${booking.TotalServiceHours.toFixed(1)} hrs`}         color="#6366f1" />
          <InfoRow label="Total Service Min"   value={`${booking.TotalServiceMinutes.toLocaleString()} min`} color="#6366f1" />
          <InfoRow label="Avg. Booking"        value={`${booking.AverageBookingMinutes.toFixed(1)} min`}     color="#0ea5e9" />
          <InfoRow label="Longest Booking"     value={`${booking.LongestBookingMinutes} min`}                color="#10b981" />
          <InfoRow label="Shortest Booking"    value={`${booking.ShortestBookingMinutes} min`}               color="#f59e0b" />
          <ProgressRow label="Booking Approval"
            value={booking.ApprovedBookings} total={booking.TotalBookings} color="#10b981" />
        </Card>
      </div>

    
      {/* ══════════════════════════════════
          SECTION 2 — Revenue & Commission
      ══════════════════════════════════ */}
      
   
  
      {/* ══════════════════════════════════
          SECTION 1 — Helper Overview
      ══════════════════════════════════ */}
      <SectionLabel title="Helper Overview" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <StatCard label="Total Helpers"  value={helperStats.TotalHelper}    icon="👥" color="#3b82f6" bg="#eff6ff" border="#dbeafe" delay={0}   />
        <StatCard label="Approved"       value={helperStats.ApprovedHelper} icon="✅" color="#10b981" bg="#ecfdf5" border="#d1fae5" delay={70}  />
        <StatCard label="Pending"        value={helperStats.PendingHelper}  icon="⏳" color="#0b90f5" bg="#eff6ff" border="#bfdbfe" delay={140} />
        <StatCard label="Rejected"       value={helperStats.RejectedHelper} icon="❌" color="#ef4444" bg="#fef2f2" border="#fecaca" delay={210} />
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