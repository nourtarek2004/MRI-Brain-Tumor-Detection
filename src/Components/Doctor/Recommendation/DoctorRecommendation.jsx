import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUserInjured,
  FaRobot,
  FaClock,
} from "react-icons/fa";

import NavRole from "../../NavRole/NavRole";

export default function DoctorRecommendation() {

  const token = localStorage.getItem("token");

  const [recommendations, setRecommendations] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [text, setText] = useState("");
  const [patientId, setPatientId] = useState("");

  const [alert, setAlert] = useState(null);

  // ================= ALERT =================
  function showAlert(type, message) {
    setAlert({ type, message });

    setTimeout(() => setAlert(null), 3000);
  }

  // ================= GET RECOMMENDATIONS =================
  async function fetchRecommendations() {
    try {
      const res = await axios.get(
        "https://mri-production-7e28.up.railway.app/api/doctor/recommendations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendations(res.data.data || []);
    } catch (err) {
      showAlert("error", "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }

  // ================= GET PATIENTS =================
  async function fetchPatients() {
    try {
      const res = await axios.get(
        "https://mri-production-7e28.up.railway.app/api/doctor/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchRecommendations();
    fetchPatients();
  }, []);

  // ================= ADD RECOMMENDATION =================
  async function addRecommendation() {

    if (!patientId) {
      return showAlert("error", "Please select patient");
    }

    if (!text.trim()) {
      return showAlert("error", "Write recommendation first");
    }

    try {
      await axios.post(
        `https://mri-production-7e28.up.railway.app/api/doctor/patients/${patientId}/recommendation`,
        {
          note: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText("");
      setPatientId("");

      showAlert("success", "Recommendation added");

      fetchRecommendations();

    } catch (err) {
      showAlert("error", "Failed to add recommendation");
    }
  }

  // ================= UPDATE STATUS =================
  async function updateStatus(id, status) {
    try {
      await axios.put(
        `https://mri-production-7e28.up.railway.app/api/doctor/recommendations/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlert("success", "Updated successfully");

      fetchRecommendations();

    } catch (err) {
      showAlert("error", "Update failed");
    }
  }

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen p-4 md:p-8">

        {/* ALERT */}
        {alert && (
          <div className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-xl text-white shadow-lg
            ${alert.type === "success" ? "bg-blue-500" : "bg-red-500"}
          `}>
            {alert.message}
          </div>
        )}

        {/* HEADER */}
        <h1 className="text-2xl font-bold mt-10 mb-6">
          Doctor Recommendations
        </h1>

        {/* ================= ADD RECOMMENDATION ================= */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          {/* PATIENT SELECT */}
          <div className="mb-5">

            <label className="block text-sm font-semibold mb-2 text-gray-600">
              Select Patient
            </label>

            <div className="relative">

              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-xl p-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >

                <option value="">
                  Choose patient...
                </option>

                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.patientName}
                  </option>
                ))}

              </select>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>

            </div>

          </div>

          {/* TEXTAREA */}
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write recommendation..."
            className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            onClick={addRecommendation}
            className="mt-4 bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600"
          >
            Submit
          </button>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4 text-left">Patient</th>
                <th>Date</th>
                <th>AI</th>
                <th>Doctor</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {recommendations.map((r) => (
                <tr key={r.id} className="border-b text-sm">

                  <td className="p-4 flex items-center gap-2">
                    <FaUserInjured className="text-blue-500" />
                    {r.patientName}
                  </td>

                  <td>
                    <FaClock className="inline mr-1" />
                    {new Date(r.date).toLocaleDateString()}
                  </td>

                  <td>{r.aiRecommendation}</td>

                  <td>{r.doctorComment || "—"}</td>

                  <td className="flex gap-2 p-2">

                    <button
                      onClick={() => updateStatus(r.id, "approved")}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(r.id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Reject
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
