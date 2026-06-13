import React, { useEffect, useState } from "react";
import axios from "axios";
import NavRole from "../../NavRole/NavRole";

export default function DoctorReports() {
  const token = localStorage.getItem("token");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  async function fetchReports() {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://mri-production-7e28.up.railway.app/api/doctor/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports =
    statusFilter === "all"
      ? reports
      : reports.filter(
          (r) =>
            r.status?.toLowerCase() === statusFilter.toLowerCase()
        );

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "completed":
        return "bg-blue-100 text-blue-600";
      case "reviewed":
        return "bg-purple-100 text-purple-600";
      case "pending ":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen p-3 sm:p-4 md:p-8">

        <h1 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-10 mb-4 sm:mb-6">
          Doctor Reports
        </h1>

        {/* FILTER (scrollable on mobile) */}
        <div className="mb-4 flex gap-2 sm:gap-3 flex-nowrap overflow-x-auto pb-2">

          {["all", "pending ", "approved", "completed", "reviewed"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm border transition
                ${
                  statusFilter.toLowerCase() === st.toLowerCase()
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {st}
              </button>
            )
          )}

        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow overflow-x-auto">

          <table className="w-full min-w-[700px] sm:min-w-[900px] text-xs sm:text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left ">Patient</th>
                <th className="p-3   text-left">Date</th>
                <th className="p-3 sm:p-4 text-left">Tumor</th>
                <th className="p-3 sm:p-4  text-left">Confidence</th>
                <th className="p-3 sm:p-4 hidden sm:table-cell  text-left">Doctor Notes</th>
                <th className="p-3 sm:p-4 text-left">Status</th>
              </tr>
            </thead>

          <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center p-6">
                          Loading...
                        </td>
                      </tr>
                    ) : filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center p-6 text-gray-400">
                          No reports found
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((r) => (
                        <tr key={r.id} className="border-b hover:bg-gray-50">

                          {/* Patient */}
                          <td className="p-3 sm:p-4 font-medium">
                            {r.patientName}
                          </td>

                          {/* Date */}
                          <td className="p-3 sm:p-4 whitespace-nowrap">
                            {r.scanDate
                              ? new Date(r.scanDate).toLocaleDateString()
                              : "--"}
                          </td>

                          {/* Tumor */}
                          <td className="p-3 sm:p-4">
                            {r.tumorType || (
                              r.tumorDetected
                                ? "Tumor Detected"
                                : "Normal"
                            )}
                          </td>

                          {/* Confidence */}
                          <td className="p-3 sm:p-4">
                              {r.confidence ? (
                                <span className="bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs">
                                  {r.confidence}
                                </span>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                                  D
                                </div>
                              )}
                            </td>

                          {/* Doctor Notes */}
                          <td className="p-3 sm:p-4 max-w-[200px] truncate text-gray-600 hidden sm:table-cell">
                            {r.doctorNotes || "No notes"}
                          </td>

                          {/* Status */}
                          <td className="p-3 sm:p-4">
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs ${getStatusColor(
                                r.status
                              )}`}
                            >
                              {r.status}
                            </span>
                          </td>

                        </tr>
                      ))
                    )}
</tbody>

          </table>

        </div>
      </div>
    </>
  );
}