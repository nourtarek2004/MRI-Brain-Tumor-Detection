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
    async function fetchData() {
      try {
        setLoading(true);

        const summaryRes = await api.get(
          "/api/patient/dashboard/summary"
        );

        setSummary(summaryRes.data.data);

        const reportsRes = await api.get(
          "/api/patient/reports"
        );

        setReports(reportsRes.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ================= NORMALIZE CONFIDENCE =================
  const formatConfidence = (value) => {
    if (value === null || value === undefined) return "N/A";

    // لو القيمة أكبر من 1 معناها percentage جاهزة
    if (value > 1) return `${value.toFixed(1)}%`;

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
    const confirmDelete = window.confirm(
      "Delete this report?"
    );

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

  const linkClass = (path) =>
    `flex items-center gap-2 p-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-500 text-white shadow"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">

      {/* SIDEBAR */}
      <div className="hidden md:flex w-[240px] bg-white border-r p-4 flex-col h-screen sticky top-0">

        <div className="mb-8 flex justify-center">
          <img src={logo} alt="logo" className="w-28" />
        </div>

        <ul className="space-y-3 text-sm">

          <li>
            <Link
              to="/dashboard-patient"
              className={linkClass("/dashboard-patient")}
            >
              <FaChartBar /> Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/scan-patient"
              className={linkClass("/scan-patient")}
            >
              <FaUpload /> Upload Scan
            </Link>
          </li>

          <li>
            <Link
              to="/reports-patient"
              className={linkClass("/reports-patient")}
            >
              <FaFileAlt /> My Reports
            </Link>
          </li>

          <li>
            <Link
              to="/recommendation-patient"
              className={linkClass("/recommendation-patient")}
            >
              <FaLightbulb /> Recommendation
            </Link>
          </li>

        </ul>

        <button className="mt-auto flex items-center gap-2 p-2 rounded-lg text-red-500 hover:bg-red-50 w-full">
          <FaSignOutAlt /> Log out
        </button>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-6">

        {/* HEADER */}
        <div className="mb-6 mt-8">
          <h1 className="text-2xl font-bold text-blue-600">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 text-sm">
            Your MRI dashboard overview
          </p>
        </div>

        {/* SUMMARY */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="bg-gradient-to-br from-blue-500 to-blue-400 text-white p-4 rounded-2xl shadow">
              <p className="text-xs opacity-90">
                Total Scans
              </p>

              <h2 className="text-2xl font-bold">
                {summary.totalScans}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500">
                Pending
              </p>

              <h2 className="text-2xl font-bold text-yellow-500">
                {summary.pendingScans}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500">
                Reviewed
              </p>

              <h2 className="text-2xl font-bold text-green-500">
                {summary.reviewedScans}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500">
                Accuracy
              </p>

              <h2 className="text-2xl font-bold text-blue-600">
                {formatConfidence(summary.totalAccuracy)}
              </h2>
            </div>

          </div>
        )}

        {/* REPORTS */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="p-4 border-b bg-blue-50">
            <h2 className="font-semibold text-blue-600">
              Recent Reports
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-500">
              Loading...
            </p>
          ) : reports.length === 0 ? (
            <p className="p-6 text-center text-gray-400">
              No reports found
            </p>
          ) : (
            <>

              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-blue-50 text-blue-600">
                    <tr>
                      <th className="p-3 text-left">
                        Date
                      </th>

                      <th className="p-3 text-left">
                        Tumor
                      </th>

                      <th className="p-3 text-left">
                        Confidence
                      </th>

                      <th className="p-3 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.map((r) => (
                      <tr
                        key={r.id}
                        className="border-t hover:bg-blue-50"
                      >

                        <td className="p-3">
                          {new Date(
                            r.date
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-3 font-medium">
                          {r.tumorType || "N/A"}
                        </td>

                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                            {formatConfidence(
                              r.confidenceScore
                            )}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-3">

                            {/* DOWNLOAD */}
                            <button
                              onClick={() =>
                                handleDownloadReport(r.id)
                              }
                              className="w-9 h-9 rounded-lg bg-blue-100 hover:bg-blue-500 hover:text-white text-blue-600 flex items-center justify-center transition"
                            >
                              <FaDownload size={14} />
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() =>
                                handleDeleteReport(r.id)
                              }
                              disabled={
                                deletingId === r.id
                              }
                              className="w-9 h-9 rounded-lg bg-red-100 hover:bg-red-500 hover:text-white text-red-600 flex items-center justify-center transition disabled:opacity-50"
                            >
                              <FaTrash size={14} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="md:hidden p-4 space-y-3">

                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="border rounded-xl p-4 bg-white shadow-sm"
                  >

                    <div className="flex justify-between mb-2">

                      <span className="text-xs text-gray-500">
                        {new Date(
                          r.date
                        ).toLocaleDateString()}
                      </span>

                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {formatConfidence(
                          r.confidenceScore
                        )}
                      </span>

                    </div>

                    <p className="font-semibold text-gray-700 mb-3">
                      {r.tumorType || "N/A"}
                    </p>

                    <div className="flex items-center gap-3">

                      {/* DOWNLOAD */}
                      <button
                        onClick={() =>
                          handleDownloadReport(r.id)
                        }
                        className="w-9 h-9 rounded-lg bg-blue-100 hover:bg-blue-500 hover:text-white text-blue-600 flex items-center justify-center transition"
                      >
                        <FaDownload size={14} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDeleteReport(r.id)
                        }
                        disabled={deletingId === r.id}
                        className="w-9 h-9 rounded-lg bg-red-100 hover:bg-red-500 hover:text-white text-red-600 flex items-center justify-center transition disabled:opacity-50"
                      >
                        <FaTrash size={14} />
                      </button>

                    </div>

                  </div>
                ))}

              </div>

            </>
          )}

        </div>

      </div>
    </div>
  );
}