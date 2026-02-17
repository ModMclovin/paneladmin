import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Stack } from "@mui/material";

const StatusBadge = ({ value }) => {
  const isCompleted = value === "Completed";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "3px",
      padding: "0px 6px", margin: "3px 0",
      borderRadius: "20px", lineHeight: "16px",
      background: isCompleted ? "#ecfdf5" : "#fffbeb",
      color: isCompleted ? "#059669" : "#d97706",
      fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.2px",
      fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
    }}>
      <span style={{
        width: "3.5px", height: "3.5px", borderRadius: "50%", flexShrink: 0,
        background: isCompleted ? "#10b981" : "#f59e0b",
      }}/>
      {value}
    </span>
  );
};

const buildColumns = () => [
  {
    field: "sn", headerName: "S.N", width: 55, sortable: false,
    renderCell: ({ api, row }) => {
      const id = row.id || `${row.purchaseOrderName}-${row.hospitalName}`;
      const index = api.getSortedRowIds().indexOf(id);
      return <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>{index + 1}</span>;
    },
  },
  {
    field: "purchaseOrderName", headerName: "Purchase Order", minWidth: 160, flex: 1.5,
    renderCell: ({ value }) => (
      <span style={{
        fontSize: "12.5px", fontWeight: 500, color: "#111827",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
      }}>{value}</span>
    ),
  },
  {
    field: "hospitalName", headerName: "Hospital", minWidth: 150, flex: 1.5,
    renderCell: ({ value }) => (
      <span style={{
        fontSize: "12.5px", color: "#374151",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
      }}>{value}</span>
    ),
  },
  {
    field: "amount", headerName: "Amount (Rs)", minWidth: 110, flex: 0.9,
    renderCell: ({ value }) => (
      <span style={{
        fontSize: "13px", fontWeight: 600, color: "#0f766e",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
      }}>₹{Number(value).toLocaleString()}</span>
    ),
  },
  {
    field: "remainingAmount", headerName: "Remaining (Rs)", minWidth: 120, flex: 0.9,
    renderCell: ({ value }) => (
      <span style={{
        fontSize: "13px", fontWeight: 600,
        color: value > 0 ? "#dc2626" : "#059669",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
      }}>₹{Number(value).toLocaleString()}</span>
    ),
  },
  {
    field: "mobile", headerName: "Mobile", minWidth: 120, flex: 0.9,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>{value}</span>
    ),
  },
  {
    field: "status", headerName: "Status", minWidth: 100, flex: 0.7,
    renderCell: ({ value }) => <StatusBadge value={value} />,
  },
];

export default function DepositGrid({ deposits }) {
  const columns = buildColumns();

  return (
    <Box sx={{
      borderRadius: "14px", overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.06)",
      background: "#fff", border: "1px solid #f0f2f5",
    }}>
      {/* Header */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 3, py: 2, borderBottom: "1px solid #f3f4f6",
      }}>
        <Box>
          <Typography sx={{
            fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            fontWeight: 700, fontSize: "15px", color: "#111827",
          }}>
            Patient Deposits
          </Typography>
          <Typography sx={{
            fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            fontSize: "12px", color: "#9ca3af", mt: 0.3,
          }}>
            {deposits.length} record{deposits.length !== 1 ? "s" : ""} found
          </Typography>
        </Box>

        {/* Legend */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {[{ label: "Completed", dot: "#10b981" }, { label: "Pending", dot: "#f59e0b" }].map(({ label, dot }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: dot }} />
              <Typography sx={{ fontSize: "11px", color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={deposits}
        columns={columns}
        getRowId={(row) => row.id || `${row.purchaseOrderName}-${row.hospitalName}`}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
        disableSelectionOnClick
        disableColumnResize={false}
        rowHeight={52}
        sx={{
          border: "none",
          fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
          "& .MuiDataGrid-columnHeaders": {
            background: "#f9fafb", borderBottom: "1px solid #f0f2f5",
            minHeight: "44px !important",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "11.5px", fontWeight: 700, color: "#6b7280",
            letterSpacing: "0.5px", textTransform: "uppercase",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "flex", color: "#e5e7eb",
            "&:hover": { color: "#3b82f6" },
          },
          "& .MuiDataGrid-row": {
            transition: "background 0.12s", borderBottom: "1px solid #f3f4f6",
          },
          "& .MuiDataGrid-row:nth-of-type(even)": { background: "#fafbfc" },
          "& .MuiDataGrid-row:hover": { background: "#f0f7ff !important" },
          "& .MuiDataGrid-cell": {
            border: "none", outline: "none !important",
            display: "flex", alignItems: "center",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #f0f2f5", background: "#fafbfc", minHeight: "44px",
          },
          "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            fontSize: "12px", color: "#6b7280",
          },
          "& ::-webkit-scrollbar": { height: "5px" },
          "& ::-webkit-scrollbar-track": { background: "#f9fafb" },
          "& ::-webkit-scrollbar-thumb": { background: "#e5e7eb", borderRadius: "10px" },
        }}
      />
    </Box>
  );
}