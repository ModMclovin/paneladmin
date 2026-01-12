import React, { useState } from "react";
import {
  User,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";

export default function HospitalAdminDashboard({ onLogout }) {
  const NGROK_API_URL = "URL yata";
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Samarat",
      specialty: "Cardiology",
      email: "samrat@gmail.com",
      available: true,
      schedule: { date: "2025-12-25", startTime: "09:00", endTime: "17:00" },
    },
    {
      id: 2,
      name: "Dr. Rabina",
      specialty: "Pediatrics",
      email: "rabina@gmail.com",
      available: false,
      schedule: { date: "2025-12-25", startTime: "10:00", endTime: "14:00" },
    },
    {
      id: 3,
      name: "Dr. Sita",
      specialty: "Orthopedics",
      email: "sita@gmail.com",
      available: true,
      schedule: { date: "2025-12-25", startTime: "08:00", endTime: "16:00" },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorEmail: "",
    doctorName: "",
    specialty: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setFormData({
      doctorEmail: "",
      doctorName: "",
      specialty: "",
      date: "",
      startTime: "",
      endTime: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (doctor) => {
    setFormData({
      doctorEmail: doctor.email,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: doctor.schedule.date,
      startTime: doctor.schedule.startTime,
      endTime: doctor.schedule.endTime,
    });
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (
      !formData.doctorEmail ||
      !formData.doctorName ||
      !formData.specialty ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        doctorEmail: formData.doctorEmail,
        doctorSchedules: [
          {
            scheduleDate: formData.date + "T" + formData.startTime + ":00.000Z",
            startTime: formData.startTime,
            endTime: formData.endTime,
          },
        ],
      };

      const response = await fetch(`${NGROK_API_URL}/addDoctorSchedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save doctor schedule");
      }

      const data = await response.json();
      console.log("Doctor schedule saved:", data);

      if (editingId) {
        setDoctors(
          doctors.map((doc) =>
            doc.id === editingId
              ? {
                  ...doc,
                  name: formData.doctorName,
                  email: formData.doctorEmail,
                  specialty: formData.specialty,
                  schedule: {
                    date: formData.date,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                  },
                }
              : doc
          )
        );
      } else {
        const newDoctor = {
          id: Math.max(...doctors.map((d) => d.id), 0) + 1,
          name: formData.doctorName,
          email: formData.doctorEmail,
          specialty: formData.specialty,
          available: true,
          schedule: {
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
          },
        };
        setDoctors([...doctors, newDoctor]);
      }

      setShowForm(false);
      alert("Doctor schedule saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving doctor schedule: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDoctors(doctors.filter((doc) => doc.id !== id));
  };

  const toggleAvailability = (id) => {
    setDoctors(
      doctors.map((doc) =>
        doc.id === id ? { ...doc, available: !doc.available } : doc
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">JC</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">JevanCare</h1>
              <p className="text-xs text-blue-600 font-medium">
                Hospital Admin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Logout"
            >
              <User size={20} className="text-gray-600" />
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2">
            Doctor Schedule Management
          </h2>
          <p className="text-gray-600">
            Manage doctor availability and assign schedules
          </p>
        </div>

        {/* Search & Add Button */}
        <div className="flex gap-4 mb-6 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by doctor name, email or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all font-medium"
          >
            <Plus size={18} />
            Add Doctor Schedule
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {editingId ? "Edit Doctor Schedule" : "Add New Doctor Schedule"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor Email *
                  </label>
                  <input
                    type="email"
                    value={formData.doctorEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, doctorEmail: e.target.value })
                    }
                    placeholder="e.g., doctor@hospital.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) =>
                      setFormData({ ...formData, doctorName: e.target.value })
                    }
                    placeholder="e.g., Dr. Rajesh Kumar"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty *
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) =>
                      setFormData({ ...formData, specialty: e.target.value })
                    }
                    placeholder="e.g., Cardiology"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all font-medium disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Cards */}
        <div className="space-y-4">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {doctor.specialty}
                      </p>
                      <p className="text-sm text-gray-500 mb-2 break-all">
                        {doctor.email}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1 text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                          <Calendar
                            size={14}
                            className="text-blue-500 flex-shrink-0"
                          />
                          {doctor.schedule.date}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                          <Clock
                            size={14}
                            className="text-blue-500 flex-shrink-0"
                          />
                          {doctor.schedule.startTime} -{" "}
                          {doctor.schedule.endTime}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => toggleAvailability(doctor.id)}
                      className={`p-2 rounded-lg transition-all ${
                        doctor.available
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={doctor.available ? "Available" : "Not Available"}
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => handleEditClick(doctor)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Availability Status */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  {doctor.available ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">
                        Available
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-600">
                        Not Available
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <AlertCircle size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No doctors found</p>
              <p className="text-gray-500 text-sm">
                Try adding a new doctor schedule
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
