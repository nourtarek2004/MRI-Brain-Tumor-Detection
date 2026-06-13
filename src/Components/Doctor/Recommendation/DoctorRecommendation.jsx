import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserInjured,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import NavRole from "../../NavRole/NavRole";

export default function DoctorRecommendation() {
  const token = localStorage.getItem("token");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [patients, setPatients] = useState([]);
  const [text, setText] = useState("");
  const [patientId, setPatientId] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const BASE_URL =
    "https://mri-production-7e28.up.railway.app";

  // ================= ALERT =================
  function showAlert(type, message) {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  }

  // ================= GET REPORTS =================
  async function fetchReports() {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/doctor/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.data || [];

      // 🔥 فلترة: pending = confidence < 50 OR status not completed
      const pendingOnly = data.filter((r) => {
        const confidence = parseFloat(r.confidence);
        return confidence < 50;
      });

      setReports(pendingOnly);
    } catch (err) {
      console.log(err);
      showAlert("error", "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
    fetchPatients();      
    fetchRecommendations(); // القديم
  }, []);

  // ================= UPDATE STATUS =================
  async function updateStatus(id, status) {
    try {
      await axios.put(
        `${BASE_URL}/api/doctor/recommendations/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlert("success", `Report ${status}`);
      fetchReports();
    } catch (err) {
      console.log(err);
      showAlert("error", "Update failed");
    }
  }
  async function fetchPatients() {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/doctor/patients`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPatients(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
}
 async function fetchRecommendations() {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/doctor/recommendations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setRecommendations(res.data.data || []);
  } catch (err) {
    console.log(err);
  }
}
 async function addRecommendation() {
  if (!patientId) return showAlert("error", "Select patient");
  if (!text.trim()) return showAlert("error", "Write note");

  try {
    await axios.post(
      `${BASE_URL}/api/doctor/patients/${patientId}/recommendation`,
      { note: text },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setText("");
    setPatientId("");

    showAlert("success", "Recommendation added");

    fetchRecommendations();
  }
   catch (err) {
    showAlert("error", "Failed to add recommendation");
  }
}

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen p-6 md:p-10">

        {/* ALERT */}
        {alert && (
          <div
            className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-xl text-white shadow-lg
            ${alert.type === "success" ? "bg-blue-500" : "bg-red-500"}
          `}
          >
            {alert.message}
          </div>
        )}

        {/* TITLE */}
        <h1 className="text-2xl font-bold mt-10 mb-6">
          Pending AI Reports
        </h1>
        {/* ================= RECOMMENDATIONS ================= */}
  <div className="bg-white rounded-2xl shadow p-6 mt-8  mb-10">

        <h2 className="text-xl font-bold mb-4">
          Doctor Recommendations
        </h2>

        {/* SELECT PATIENT */}
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full border p-3 rounded-xl mb-3"
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.patientName}
            </option>
          ))}
        </select>

        {/* TEXT */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border p-3 rounded-xl"
          placeholder="Write recommendation..."
        />

        <button
          onClick={addRecommendation}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          Add Recommendation
        </button>

        {/* LIST */}
        <div className="mt-6 space-y-3">

          {recommendations.map((r) => (
            <div
              key={r.id}
              className="border p-3 rounded-xl"
            >
              <div className="font-semibold">
                {r.patientName}
              </div>

              <div className="text-sm text-gray-600">
                {r.aiRecommendation}
              </div>

              <div className="text-xs text-gray-400">
                {r.doctorComment || "No comment"}
              </div>
            </div>
          ))}

        </div>

      </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto  mt-10">

          <table className="w-full min-w-[800px]">

            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4 text-left">Patient</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Tumor</th>
                <th  className="p-4 text-left">Confidence</th>
                <th  className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>

              {reports.map((r) => (
                <tr key={r.id} className="border-b text-sm">

                  {/* PATIENT */}
                  <td className="p-4 flex items-center gap-2">
                    <FaUserInjured className="text-blue-500" />
                    {r.patientName}
                  </td>

                  {/* DATE */}
                  <td>
                    <FaClock className="inline mr-1" />
                    {new Date(r.scanDate).toLocaleDateString()}
                  </td>

                  {/* TUMOR */}
                  <td>{r.tumorType}</td>

                  {/* CONFIDENCE */}
                  <td>{r.confidence}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs
                      ${
                        r.status === "Reviewed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="flex gap-2 p-2">

                    <button
                      onClick={() =>
                        updateStatus(r.id, "approved")
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(r.id, "rejected")
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(r.id, "completed")
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    >
                      Complete
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>
    </>
  );
}