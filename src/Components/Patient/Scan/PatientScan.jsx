import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import NavRole from "../../NavRole/NavRole";

export default function PatientScan() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const report = result?.reports?.[0]; // أهم جزء

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ================= CONFIDENCE FORMAT =================
  const formatConfidence = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (value > 1) return `${value.toFixed(1)}%`;
    return `${(value * 100).toFixed(1)}%`;
  };

  // ================= UPLOAD =================
  async function handleUpload() {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("scanImage", file);

    try {
      setLoading(true);
      setResult(null);
      setScanId(null);

      const res = await axios.post(
        "https://mri-production-7e28.up.railway.app/api/patient/scans/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setScanId(res.data.data._id);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  // ================= POLLING =================
  useEffect(() => {
    if (!scanId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `https://mri-production-7e28.up.railway.app/api/patient/scans/result/${scanId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data.data;

        setResult({
          scan: data.scan,
          reports: data.reports || [],
        });

        if (
          data.scan.status === "Completed" ||
          data.scan.status === "Rejected"
        ) {
          clearInterval(interval);
        }
      } catch (err) {
        console.log(err);

        if (err.response?.status === 401) {
          alert("Session expired");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [scanId]);

  const isTumor =
    report?.tumorType && report.tumorType.toLowerCase() !== "normal";

  return (
    <>
      <NavRole />

      <div className="min-h-screen bg-[#F5F7FB] pt-24 px-6">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-xl font-semibold mb-2">
            Upload MRI Scan
          </h1>

          <p className="text-gray-500 mb-6 text-sm">
            Upload your MRI image below and let AI analyze it
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* UPLOAD */}
            <div className="bg-white p-6 rounded-xl shadow">

              <input type="file" hidden id="file" onChange={handleFileChange} />

              <label htmlFor="file" className="cursor-pointer">
                <div className="border-2 border-dashed p-8 text-center rounded-xl">

                  {preview ? (
                    <img src={preview} className="w-40 mx-auto mb-4" />
                  ) : (
                    <FaUpload className="text-4xl mx-auto text-blue-500 mb-3" />
                  )}

                  <p className="text-gray-500">Upload MRI image</p>
                </div>
              </label>

              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                {loading ? "Uploading..." : "Upload & Analyze"}
              </button>
            </div>

            {/* RESULT */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="font-semibold mb-4">Result</h2>

              {!report && (
                <p className="text-gray-400">No result yet</p>
              )}

              {report && (
                <div className={`p-5 rounded-2xl border ${
                  isTumor
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}>

                  <h3 className={`font-bold mb-4 ${
                    isTumor ? "text-red-600" : "text-green-600"
                  }`}>
                    {isTumor ? "Tumor Detected" : "Normal Scan"}
                  </h3>

                  {/* Tumor Type */}
                  <div className="bg-white p-3 rounded mb-3">
                    <p className="text-gray-500 text-sm">Tumor Type</p>
                    <p className={isTumor ? "text-red-600" : "text-green-600"}>
                      {report.tumorType}
                    </p>
                  </div>

                  {/* Confidence */}
                  <div className="bg-white p-3 rounded mb-3">
                    <p className="text-gray-500 text-sm">Confidence</p>
                    <p className={isTumor ? "text-red-500" : "text-green-600"}>
                      {formatConfidence(report.confidenceScore)}
                    </p>
                  </div>

                  {/* Notes */}
                  <div className={`p-3 rounded ${
                    isTumor ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>
                    {report.notes ||
                      (isTumor
                        ? "Please consult your doctor."
                        : "Your MRI scan appears normal.")}
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}