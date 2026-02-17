import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, Box, Typography } from "@mui/material";

// ── Status badge ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Approved: { bg: "#ecfdf5", color: "#059669", dot: "#10b981", label: "Approved" },
    Pending:  { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b", label: "Pending"  },
    Rejected: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444", label: "Rejected" },
  };
  const s = styles[status] ?? styles.Pending;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "3px",
      padding: "0.5px 6px",
      margin: "3px 0",
      borderRadius: "20px",
    color: s.color,
      fontSize: "10px", fontWeight: 600,
      letterSpacing: "0.2px",
      lineHeight: "25px",
      fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
    }}>
      <span style={{
        width: "3.5px", height: "3.5px", borderRadius: "50%",
        background: s.dot, flexShrink: 0,
      }}/>
      {s.label}
    </span>
  );
};

// ── Action buttons ─────────────────────────────────────────────
const ActionButtons = ({ row, onStatusChange }) => (
  <Stack direction="row" spacing={0.6} alignItems="center" height="100%">
    <button
      onClick={() => onStatusChange(row, "Approved")}
      style={{
        padding: "2px 8px", borderRadius: "5px", border: "none",
        background: "#ecfdf5", color: "#059669",
        fontSize: "12px", fontWeight: 600, cursor: "pointer",
        letterSpacing: "0.1px", transition: "all 0.15s",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
       lineHeight: "25px",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#059669"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#ecfdf5"; e.currentTarget.style.color = "#059669"; }}
    >
      Approve
    </button>
    <button
      onClick={() => onStatusChange(row, "Rejected")}
      style={{
        padding: "2px 8px", borderRadius: "5px", border: "none",
        background: "#fef2f2", color: "#dc2626",
        fontSize: "12px", fontWeight: 600, cursor: "pointer",
        letterSpacing: "0.1px", transition: "all 0.15s",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
        lineHeight: "25px",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
    >
      Reject
    </button>
  </Stack>
);

// ── Column definitions ─────────────────────────────────────────
const buildColumns = (onStatusChange) => [
  {
    field: "sn", headerName: "S.N", width: 55, sortable: false,
    renderCell: ({ api, row }) => {
      const allRows = api.getSortedRowIds();
      const index = allRows.indexOf(row.id);
      return (
        <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
          {index + 1}
        </span>
      );
    },
  },
  {
    field: "name", headerName: "Name", width: 250, flex: 1,
    renderCell: ({ value }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "9px", height: "100%" }}>
        {/* Avatar circle with initials */}
        {/* <div style={{
          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #1e40af, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "11px", fontWeight: 700,
        }}>
          {value?.charAt(0)?.toUpperCase() ?? "?"}
        </div> */}
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>{value}</span>
      </div>
    ),
  },
  {
    field: "age", headerName: "Age", width: 70,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "13px", color: "#4b5563" }}>{value}</span>
    ),
  },
  {
    field: "gender", headerName: "Gender", width: 90,
    renderCell: ({ value }) => (
    <span style={{
  fontSize: "12px", fontWeight: 600,
  color: value === "Male" ? "#1d4ed8" : "#be185d",
  
  padding: "0.5px 6px", borderRadius: "20px",
  letterSpacing: "0.1px", lineHeight: "25px",
  margin: "5px 0", display: "inline-block",
  fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
}}>
  {value}
</span>
     
    ),
  },
  {
    field: "qualification", headerName: "Qualification", width: 140, flex: 1,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "12.5px", color: "#374151" }}>{value}</span>
    ),
  },
  {
    field: "pricePerHour", headerName: "Rate/hr", width: 95,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f766e" }}>
        ₹{value}
      </span>
    ),
  },
  {
    field: "phoneNumber", headerName: "Phone", width: 130,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "12.5px", color: "#6b7280", fontFamily: "monospace" }}>{value}</span>
    ),
  },
  {
    field: "email", headerName: "Email", width: 195, flex: 1.2,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "12px", color: "#6b7280" }}>{value}</span>
    ),
  },
  {
    field: "status", headerName: "Status", width: 110,
    renderCell: ({ value }) => <StatusBadge status={value} />,
  },
  {
    field: "actions", headerName: "Actions", width: 160, sortable: false,
    renderCell: ({ row }) =>
      row.status === "Pending"
        ? <ActionButtons row={row} onStatusChange={onStatusChange} />
        : <span style={{ fontSize: "12px", color: "#d1d5db", fontStyle: "italic" }}>—</span>,
  },
];

// ── Main component ─────────────────────────────────────────────
export default function HelpersGrid({ helpers, loading, onStatusChange }) {
  const columns = buildColumns(onStatusChange);

  return (
    <Box sx={{
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.06)",
      background: "#fff",
      border: "1px solid #f0f2f5",
    }}>
      {/* ── Card header ── */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 3, py: 2,
        borderBottom: "1px solid #f3f4f6",
      }}>
        <Box>
          <Typography sx={{
            fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            fontWeight: 700, fontSize: "15px", color: "#111827",
          }}>
            Helpers 
          </Typography>
          <Typography sx={{
            fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            fontSize: "12px", color: "#9ca3af", mt: 0.3,
          }}>
            {helpers.length} record{helpers.length !== 1 ? "s" : ""} found
          </Typography>
        </Box>

        {/* Legend */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {[
            { label: "Approved", dot: "#10b981" },
            { label: "Pending",  dot: "#f59e0b" },
            { label: "Rejected", dot: "#ef4444" },
          ].map(({ label, dot }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: dot }} />
              <Typography sx={{ fontSize: "11px", color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ── DataGrid ── */}
      <DataGrid
        rows={helpers}
        columns={columns}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
        disableSelectionOnClick
        rowHeight={52}
        sx={{
          border: "none",
          fontFamily: "'DM Sans', ui-sans-serif, sans-serif",

          // Header
          "& .MuiDataGrid-columnHeaders": {
            background: "#f9fafb",
            borderBottom: "1px solid #f0f2f5",
            minHeight: "44px !important",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "11.5px",
            fontWeight: 700,
            color: "#6b7280",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-iconButtonContainer .MuiIconButton-root": {
            color: "#9ca3af",
          },

          // Rows
          "& .MuiDataGrid-row": {
            transition: "background 0.12s",
            borderBottom: "1px solid #f3f4f6",
          },
          "& .MuiDataGrid-row:nth-of-type(even)": {
            background: "#fafbfc",
          },
          "& .MuiDataGrid-row:hover": {
            background: "#f0f7ff !important",
            cursor: "default",
          },

          // Cells
          "& .MuiDataGrid-cell": {
            border: "none",
            outline: "none !important",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },

          // Footer
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #f0f2f5",
            background: "#fafbfc",
            minHeight: "44px",
          },
          "& .MuiTablePagination-root": {
            fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            fontSize: "12px",
            color: "#6b7280",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            fontSize: "12px",
            color: "#6b7280",
          },

          // Scrollbar
          "& ::-webkit-scrollbar": { height: "5px" },
          "& ::-webkit-scrollbar-track": { background: "#f9fafb" },
          "& ::-webkit-scrollbar-thumb": { background: "#e5e7eb", borderRadius: "10px" },
        }}
      />
    </Box>
  );
}
