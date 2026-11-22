import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";
import NavRole from "../../NavRole/NavRole";
import { FaDownload, FaInfoCircle } from "react-icons/fa";

export default function PatientRecommendation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://mri-production-7e28.up.railway.app/api/patient/recommendations/latest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data.data);
      } catch (err) {
        console.log(err.response?.data || err);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchRecommendation();
  }, [token]);

  // Download handler
  async function handleDownload() {
    try {
      setDownloading(true);

      const res = await axios.get(
        "https://mri-production-7e28.up.railway.app/api/patient/recommendations/download",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "recommendation.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log("Download error:", err.response?.data || err);
      alert("Download failed. File may not exist yet.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <NavRole />

      <div className="min-h-screen bg-[#F5F7FB] p-4 md:p-8">

        {/* Header */}
        <div className="mt-10 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            AI Recommendation
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Latest medical analysis and AI suggestions
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">

          {loading ? (
            <div className="text-gray-400">Loading recommendation...</div>
          ) : !data ? (
            <div className="text-gray-400">
              No recommendation available yet.
            </div>
          ) : (
            <>
              {/* Status */}
              <div className="flex items-center gap-3 mb-4">

                <div className="w-3 h-3 rounded-full bg-blue-500"></div>

                <h2 className="text-lg font-semibold text-gray-800">
                  Result: {data.tumorType}
                </h2>

              </div>

              {/* Confidence */}
              <div className="mb-4">
                <p className="text-gray-600 text-sm mb-1">
                  Confidence Score
                </p>

                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full inline-block text-sm">
                  {(data.confidenceScore * 100).toFixed(1)}%
                </div>
              </div>

              {/* Recommendation */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">
                  Recommendation
                </p>

                <div className="bg-gray-50 border rounded-xl p-4 text-gray-700 text-sm">
                  {data.recommendation || (
                    <span className="text-gray-400 flex items-center gap-2">
                      <FaInfoCircle />
                      No recommendation generated yet
                    </span>
                  )}
                </div>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 mb-6">
                {new Date(data.recommendationDate).toLocaleString()}
              </p>

             
              
            </>
          )}

        </div>
      </div>
    </>
  );
}