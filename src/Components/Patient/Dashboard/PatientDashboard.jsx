import { useEffect, useState } from "react";
import {
  FaSignOutAlt,
  FaUpload,
  FaFileAlt,
  FaLightbulb,
  FaChartBar,
  FaDownload,
  FaTrash,
} from "react-icons/fa";

import api from "../../../api/api";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";

export default function PatientDashboard() {
  const location = useLocation();

  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ================= FETCH DATA =================
  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const summaryRes = await api.get(
        "/api/patient/dashboard/summary"
      );
      setSummary(summaryRes.data);

      const reportsRes = await api.get(
        "/api/patient/dashboard/recent-reports"
      );

      setReports(reportsRes.data.data || []);
      console.log(reportsRes.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const formatConfidence = (value) => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (value > 1) {
    return `${value.toFixed(1)}%`;
  }

  return `${(value * 100).toFixed(1)}%`;
};

  // ================= DOWNLOAD REPORT =================
  const handleDownloadReport = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://mri-production-7e28.up.railway.app/api/patient/reports/${id}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${id}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("DOWNLOAD ERROR =>", error);
    }
  };

  // ================= DELETE REPORT =================
  const handleDeleteReport = async (id) => {
    const confirmDelete = window.confirm("Delete this report?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await api.delete(`/api/patient/reports/${id}`);

      setReports((prev) =>
        prev.filter((report) => report.id !== id)
      );
    } catch (error) {
      console.log("DELETE ERROR =>", error);
    } finally {
      setDeletingId(null);
    }
  };

  // ================= ACTIVE LINK =================
  const linkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
      location.pathname === path
        ? "bg-blue-500 text-white shadow-md"
        : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
    }`;

  // ================= CHART =================
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const chartData = months.map((month, index) => {
    const count = reports.filter((r) => {
      if (!r.date) return false;
      return new Date(r.date).getMonth() === index;
    }).length;

    return {
      month,
      value: count,
    };
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F5F7FB]">

      {/* ================= SIDEBAR ================= */}
      <div className="hidden md:flex w-[250px] bg-white border-r p-5 flex-col h-screen sticky top-0">

        <div>
          <div className="mb-10 flex justify-center">
            <img src={logo} alt="logo" className="w-28" />
          </div>

          <ul className="space-y-3 text-sm">

            <li>
              <Link to="/dashboard-patient" className={linkClass("/dashboard-patient")}>
                <FaChartBar /> Dashboard
              </Link>
            </li>

            <li>
              <Link to="/scan-patient" className={linkClass("/scan-patient")}>
                <FaUpload /> Upload Scan
              </Link>
            </li>

            <li>
              <Link to="/reports-patient" className={linkClass("/reports-patient")}>
                <FaFileAlt /> My Reports
              </Link>
            </li>

            <li>
              <Link to="/recommendation-patient" className={linkClass("/recommendation-patient")}>
                <FaLightbulb /> Recommendation
              </Link>
            </li>

          </ul>
        </div>

        <button className="mt-auto flex items-center justify-center gap-2 p-3 rounded-xl text-red-500 hover:bg-red-100 transition w-full font-medium">
          <FaSignOutAlt />
          Logout
        </button>

      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-4 md:p-6 overflow-hidden">

        {/* HEADER */}
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitor your MRI scans and reports.
          </p>
        </div>

        {/* ALERT */}
        <div className="bg-blue-100 border border-blue-200 text-blue-700 p-4 rounded-2xl mb-6">
          Your latest MRI scan reports are available.
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center gap-3">
            <FaUpload className="text-blue-500 text-2xl" />
            Upload MRI Scan
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center gap-3">
            <FaFileAlt className="text-blue-500 text-2xl" />
            View Reports
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center gap-3">
            <FaLightbulb className="text-yellow-500 text-2xl" />
            Recommendations
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center gap-3">
            <FaChartBar className="text-gray-600 text-2xl" />
            Scan History
          </div>

        </div>

        {/* CHART */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm mb-6 overflow-x-auto">

          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-gray-700">
              Monthly Scan Overview
            </h2>

            <div className="text-sm text-gray-500">
              Total Scans:{" "}
              <span className="font-semibold text-blue-600">
                {reports.length}
              </span>
            </div>
          </div>

          <div className="min-w-[650px] flex items-end justify-between h-72 gap-3">

            {chartData.map((item, i) => {
              const barHeight =
                item.value === 0 ? 10 : item.value * 35;

              return (
                <div key={i} className="flex flex-col items-center flex-1">

                  <span className="text-sm text-blue-600 font-semibold mb-2">
                    {item.value}
                  </span>

                  <div className="relative w-full flex justify-center">
                    <div
                      className="w-7 md:w-9 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-2xl transition-all duration-300 hover:scale-105 shadow-md"
                      style={{ height: `${barHeight}px` }}
                    />
                  </div>

                  <span className="text-xs md:text-sm mt-3 text-gray-500">
                    {item.month}
                  </span>

                </div>
              );
            })}

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          <div className="p-5 border-b">
            <h2 className="font-semibold text-lg text-gray-700">
              Recent Reports
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">

              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Tumor Type</th>
                  <th className="p-4 text-left">Confidence</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-gray-500">
                      Loading reports...
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50 transition">

                      <td className="p-4 font-medium text-gray-700 whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                          {r.tumorType || "Not available"}
                        </span>
                      </td>

                      {/* FIXED CONFIDENCE */}
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                         {formatConfidence(r.confidenceScore)}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">

                          <button
                            onClick={() => handleDownloadReport(r.id)}
                            className="text-blue-600"
                          >
                            <FaDownload />
                          </button>

                          <button
                            onClick={() => handleDeleteReport(r.id)}
                            disabled={deletingId === r.id}
                            className="text-red-600 disabled:opacity-50"
                          >
                            <FaTrash />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>
          </div>

        </div>

      </div>
    </div>
  );
}