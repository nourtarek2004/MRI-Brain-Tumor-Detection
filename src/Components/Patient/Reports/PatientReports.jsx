import { useEffect, useState } from "react";
import {
  FaSignOutAlt,
  FaUpload,
  FaFileAlt,
  FaLightbulb,
  FaChartBar,
} from "react-icons/fa";
import api from "../../../api/api";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";

export default function PatientDashboard() {
  const location = useLocation();

  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const summaryRes = await api.get("/api/patient/dashboard/summary");
        setSummary(summaryRes.data.data);

        const reportsRes = await api.get("/api/patient/reports");
        setReports(reportsRes.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
              <p className="text-xs opacity-90">Total Scans</p>
              <h2 className="text-2xl font-bold">{summary.totalScans}</h2>
            </div>

            <div className="bg-white border border-blue-100 p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500">Pending</p>
              <h2 className="text-2xl font-bold text-yellow-500">
                {summary.pendingScans}
              </h2>
            </div>

            <div className="bg-white border border-blue-100 p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500">Reviewed</p>
              <h2 className="text-2xl font-bold text-green-500">
                {summary.reviewedScans}
              </h2>
            </div>

            <div className="bg-white border border-blue-100 p-4 rounded-2xl shadow-sm">
              <p className="text-xs text-gray-500">Accuracy</p>
              <h2 className="text-2xl font-bold text-blue-600">
                {(summary.totalAccuracy * 100).toFixed(1)}%
              </h2>
            </div>

          </div>
        )}

        {/* REPORTS */}
        <div className="bg-white rounded-2xl shadow border border-blue-50 overflow-hidden">

          <div className="p-4 bg-blue-50 border-b">
            <h2 className="font-semibold text-blue-600">
              Recent Reports
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-gray-500">Loading...</p>
          ) : reports.length === 0 ? (
            <p className="p-6 text-center text-gray-400">
              No reports found
            </p>
          ) : (
            <>
              {/* TABLE */}
              <div className="hidden md:block overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-blue-50 text-blue-600">
                    <tr>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Tumor</th>
                      <th className="p-3 text-left">Confidence</th>
                      <th className="p-3 text-left">File</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.map((r) => (
                      <tr
                        key={r.id}
                        className="border-t hover:bg-blue-50 transition"
                      >

                        <td className="p-3">
                          {new Date(r.date).toLocaleDateString()}
                        </td>

                        <td className="p-3 font-medium text-gray-700">
                          {r.tumorType || "N/A"}
                        </td>

                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                            {r.confidenceScore
                              ? (r.confidenceScore * 100).toFixed(1) + "%"
                              : "N/A"}
                          </span>
                        </td>

                        <td className="p-3">
                          {r.file ? (
                            <a
                              href={r.file}
                              target="_blank"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            "--"
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

              {/* MOBILE */}
              <div className="md:hidden p-4 space-y-3">

                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="border border-blue-100 rounded-xl p-4 shadow-sm bg-white"
                  >

                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        {new Date(r.date).toLocaleDateString()}
                      </span>

                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {r.confidenceScore
                          ? (r.confidenceScore * 100).toFixed(1) + "%"
                          : "N/A"}
                      </span>
                    </div>

                    <p className="font-semibold text-gray-700">
                      {r.tumorType || "N/A"}
                    </p>

                    {r.file && (
                      <a
                        href={r.file}
                        target="_blank"
                        className="text-blue-600 text-sm"
                      >
                        View Report
                      </a>
                    )}

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