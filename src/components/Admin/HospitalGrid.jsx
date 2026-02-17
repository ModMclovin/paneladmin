import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Stack } from "@mui/material";

const StatusBadge = ({ isActive }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "3px",
    padding: "0px 6px", margin: "3px 0",
    borderRadius: "20px", lineHeight: "16px",
    background: isActive ? "#ecfdf5" : "#fef2f2",
    color: isActive ? "#059669" : "#dc2626",
    fontSize: "9.5px", fontWeight: 600,
    letterSpacing: "0.2px",
    fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
  }}>
    <span style={{
      width: "3.5px", height: "3.5px", borderRadius: "50%",
      background: isActive ? "#10b981" : "#ef4444", flexShrink: 0,
    }}/>
    {isActive ? "Active" : "Inactive"}
  </span>
);

const buildColumns = () => [
  {
    field: "sn", headerName: "S.N", width: 55,  sortable: false,
    renderCell: ({ api, row }) => {
      const index = api.getSortedRowIds().indexOf(row.TenantId);
      return <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>{index + 1}</span>;
    },
  },
  {
    field: "TenantId", headerName: "Tenant ID", width: 90,
    renderCell: ({ value }) => (
      <span style={{
        fontSize: "11px", fontWeight: 600, color: "#6366f1",
        background: "#eef2ff", padding: "0px 6px", borderRadius: "5px",
        lineHeight: "18px", display: "inline-block",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
      }}>#{value}</span>
    ),
  },
  {
    field: "Name", headerName: "Hospital Name", width: 200, flex: 1.5,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "13px", fontWeight: 500, color: "#111827",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif" }}>{value}</span>
    ),
  },
  {
    field: "City", headerName: "City", width: 110,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "12px", color: "#4b5563",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif" }}>{value}</span>
    ),
  },
  {
    field: "Phone", headerName: "Phone", width: 130,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>{value}</span>
    ),
  },
  {
    field: "Email", headerName: "Email", width: 180, flex: 1,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "12px", color: "#6b7280",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif" }}>{value}</span>
    ),
  },
  {
    field: "IsActive", headerName: "Status", width: 95,
    renderCell: ({ value }) => <StatusBadge isActive={value} />,
  },
  {
    field: "AddedBy", headerName: "Added By", width: 130,
    renderCell: ({ value }) => (
      <span style={{ fontSize: "12px", color: "#374151",
        fontFamily: "'DM Sans', ui-sans-serif, sans-serif" }}>{value}</span>
    ),
  },
];

export default function HospitalGrid({ filteredHospitals }) {
  console.log("Grid rows:", filteredHospitals);
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
            Hospitals Directory
          </Typography>
          <Typography sx={{
            fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
            fontSize: "12px", color: "#9ca3af", mt: 0.3,
          }}>
            {filteredHospitals.length} record{filteredHospitals.length !== 1 ? "s" : ""} found
          </Typography>
        </Box>

        {/* Legend */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {[{ label: "Active", dot: "#10b981" }, { label: "Inactive", dot: "#ef4444" }].map(({ label, dot }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: dot }} />
              <Typography sx={{ fontSize: "11px", color: "#9ca3af",
                fontFamily: "'DM Sans', sans-serif" }}>{label}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={filteredHospitals}
        columns={columns}
        getRowId={(row) => row.TenantId}
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
          "& .MuiDataGrid-columnSeparator": { display: "none" },
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