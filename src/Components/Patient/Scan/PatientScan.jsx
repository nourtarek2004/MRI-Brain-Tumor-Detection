import React from 'react'

import { useState, useEffect } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import NavRole from '../../NavRole/NavRole';
export default function PatientScan() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanId, setScanId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  

  //  اختيار الصورة
  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  //  Upload
  async function handleUpload() {
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("scanImage", file);
    console.log("TOKEN:", localStorage.getItem("token"));
    try {
      setLoading(true);

      const res = await axios.post(
        "https://mri-production-9d58.up.railway.app/api/patient/scans/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("UPLOAD:", res.data);

      
      setScanId(res.data.data._id);

    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  //  Polling
  useEffect(() => {
    if (!scanId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `https://mri-production-9d58.up.railway.app/api/patient/scans/result/${scanId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("RESULT:", res.data);

        const data = res.data.data;
        setResult(data);

        if (data.scan.status === "Completed") {
          clearInterval(interval);
        }

      } catch (err) {
        console.log("Polling Error:", err);

        //  لو التوكن انتهى
        if (err.response?.status === 401) {
          alert("Session expired, please login again");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [scanId]);

  return (
    <>
    <NavRole/>
    <div className="min-h-screen bg-[#F5F7FB] pt-24 px-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-xl font-semibold mb-2">Upload MRI Scan</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Upload your MRI image below and let AI analyze it
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Upload */}
          <div className="bg-white p-6 rounded-xl shadow">

            <div className="border-2 border-dashed p-8 text-center rounded-xl">

              {preview ? (
                <img src={preview} className="mx-auto w-40 mb-4 rounded-lg" />
              ) : (
                <div>
                  <FaUpload className="text-4xl mx-auto text-blue-500 mb-3" />
                  <p className="text-gray-500">Upload MRI image</p>
                </div>
              )}

              <input type="file" hidden id="file" onChange={handleFileChange} />

              <label
                htmlFor="file"
                className="mt-4 inline-block bg-blue-500 text-white px-5 py-2 rounded-lg cursor-pointer"
              >
                Browse Files
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {loading ? "Uploading..." : "Upload & Analyze"}
            </button>
          </div>

          {/* Result */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold mb-4">Result</h2>

            {!result && (
              <p className="text-gray-400">No result yet</p>
            )}

            {result?.scan?.status === "Pending" && (
              <div className="bg-yellow-100 p-4 rounded">
                ⏳ Processing...
              </div>
            )}

            {result?.scan?.status === "Completed" && (
              <div className="space-y-3">

                <div className="bg-green-100 p-4 rounded">
                  <p>
                    <strong>Tumor:</strong>{" "}
                    {result.reports?.[0]?.tumorType || "N/A"}
                  </p>

                  <p>
                    <strong>Confidence:</strong>{" "}
                    {result.reports?.[0]?.confidence || "N/A"}%
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded">
                  {result.reports?.[0]?.notes || "No notes"}
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