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
    setLoading(true);

    // SUMMARY
    api
      .get("/api/patient/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.log(err));

    // RECENT REPORTS
    api
      .get("/api/patient/dashboard/recent-reports")
      .then((res) => setReports(res.data.data || []))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const linkClass = (path) =>
    `flex items-center gap-2 p-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "text-gray-600 hover:bg-blue-100 hover:text-blue-600"
    }`;

  // ================= MONTHLY CHART =================
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const chartData = months.map((month, index) => {
    const count = reports.filter((r) => {
      const reportMonth = new Date(r.date).getMonth();
      return reportMonth === index;
    }).length;

    return {
      month,
      value: count,
    };
  });

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">

      {/* SIDEBAR */}
      <div className="hidden md:flex w-[240px] bg-white border-r p-4 flex-col h-screen sticky top-0">

        <div>
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
        </div>

        <button className="mt-auto flex items-center gap-2 p-2 rounded-lg text-red-500 hover:bg-red-100 transition w-full">
          <FaSignOutAlt /> Log out
        </button>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-6">

        {/* HEADER */}
        <div className="mb-6 mt-6">
          <h1 className="text-xl font-bold">Welcome back 👋</h1>
          <p className="text-gray-500 text-sm">
            Here's your recent scan activity and reports.
          </p>
        </div>

        {/* NOTIFICATION */}
        <div className="bg-blue-100 text-blue-700 p-4 rounded-xl mb-6">
          Your latest MRI scan reports are available.
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center gap-2">
            <FaUpload className="text-blue-500" />
            <span>Upload MRI Scan</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center gap-2">
            <FaFileAlt className="text-blue-500" />
            <span>View Reports</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center gap-2">
            <FaLightbulb className="text-yellow-400" />
            <span>Recommendations</span>
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center gap-2">
            <FaChartBar className="text-gray-600" />
            <span>Results History</span>
          </div>

        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="font-semibold mb-6 text-lg">
            Monthly Scan Overview
          </h2>

          <div className="flex items-end justify-between h-64 gap-3">

            {chartData.map((item, i) => (
              <div key={i} className="flex flex-col items-center flex-1">

                <span className="text-xs text-gray-500">
                  {item.value}
                </span>

                <div
                  className="w-6 bg-blue-400 rounded-lg"
                  style={{
                    height: `${item.value * 20}px`,
                    minHeight: "4px",
                  }}
                />

                <span className="text-xs mt-2 text-gray-500">
                  {item.month}
                </span>

              </div>
            ))}

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="font-semibold mb-4 text-lg">
            Recent Reports
          </h2>

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Tumor Type</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center p-6 text-gray-500">
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id} className="border-b">

                    <td className="p-3">
                      {new Date(r.date).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      {r.tumorType || "Not available yet"}
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}