import React from 'react'

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import NavRole from "../../NavRole/NavRole";
import { FaSearch, FaEye } from "react-icons/fa";

export default function Reports() {
  const token = localStorage.getItem("token");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  async function fetchReports() {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://mri-production-7e28.up.railway.app/api/admin/reports",
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

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const patient =
        report.patient?.user?.username?.toLowerCase() || "";

      const doctor =
        report.doctor?.user?.username?.toLowerCase() || "";

      const tumor =
        report.tumorName?.tumorName?.toLowerCase() || "";

      return (
        patient.includes(search.toLowerCase()) ||
        doctor.includes(search.toLowerCase()) ||
        tumor.includes(search.toLowerCase())
      );
    });
  }, [reports, search]);
  const formatConfidence = (score) => {
      if (!score) return "0%";

      return score <= 1
        ? `${Math.round(score * 100)}%`
        : `${Math.round(score)}%`;
};

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen p-4 md:p-8">

        <div className="mt-10 mb-6">
          <h1 className="text-3xl font-bold">
            Reports
          </h1>

          <p className="text-gray-500 mt-2">
            View all generated MRI reports.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none"
            />
          </div>
        </div>

        <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-4">Patient</th>
                <th className="p-4">Doctor</th>
                <th className="p-4">Tumor Type</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Scan Date</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-400"
                  >
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {report.patient?.user?.username || "N/A"}
                    </td>

                    <td className="p-4">
                      {report.doctor?.user?.username || "Not Assigned"}
                    </td>

                    <td className="p-4">
                      {report.tumorName?.tumorName || "N/A"}
                    </td>

                    <td className="p-4 text-blue-600">
                            {formatConfidence(report.confidenceScore)}
                          </td>

                    <td className="p-4">
                      {report.scan?.scanDate
                        ? new Date(
                            report.scan.scanDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          setSelectedReport(report)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                      >
                        <FaEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-2xl shadow-sm p-4"
            >
              <h3 className="font-semibold">
                {report.patient?.user?.username}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Doctor:{" "}
                {report.doctor?.user?.username ||
                  "Not Assigned"}
              </p>

              <p className="text-sm mt-2">
                Tumor:{" "}
                {report.tumorName?.tumorName ||
                  "N/A"}
              </p>

              <p className="text-sm mt-1">
                Confidence:{" "}
                {Math.round(
                  (report.confidenceScore || 0) * 100
                )}
                %
              </p>

              <button
                onClick={() =>
                  setSelectedReport(report)
                }
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded-xl"
              >
                View Report
              </button>
            </div>
          ))}
        </div>

        {selectedReport && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-6 w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Report Details
                </h2>

                <button
                  onClick={() =>
                    setSelectedReport(null)
                  }
                  className="text-gray-500 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">

                <Info
                  label="Patient"
                  value={
                    selectedReport.patient?.user
                      ?.username
                  }
                />

                <Info
                  label="Doctor"
                  value={
                    selectedReport.doctor?.user
                      ?.username || "Not Assigned"
                  }
                />

                <Info
                  label="Tumor Type"
                  value={
                    selectedReport.tumorName
                      ?.tumorName || "N/A"
                  }
                />

                <Info label="Confidence"
                    value={formatConfidence(
                      selectedReport.confidenceScore
                    )}
                  />

                <Info
                  label="Status"
                  value={
                    selectedReport.status || "N/A"
                  }
                />

                <Info
                  label="Scan Date"
                  value={
                    selectedReport.scan?.scanDate
                      ? new Date(
                          selectedReport.scan.scanDate
                        ).toLocaleString()
                      : "N/A"
                  }
                />

                <Info
                  label="Report Date"
                  value={
                    selectedReport.reportDate
                      ? new Date(
                          selectedReport.reportDate
                        ).toLocaleString()
                      : "N/A"
                  }
                />

              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-3">
                  Recommendation
                </h3>

                <p className="text-gray-700">
                  {selectedReport.recommendation ||
                    selectedReport.aiRecommendation ||
                    "No recommendation available"}
                </p>
              </div>

            </div>

          </div>
        )}
      </div>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value || "-"}
      </p>
    </div>
  );
}