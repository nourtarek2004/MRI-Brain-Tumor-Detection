import { useEffect, useState } from "react";
import axios from "axios";
import NavRole from "../../NavRole/NavRole";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function DoctorDashboard() {
  const [data, setData] = useState(null);
  const [reports, setReports] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  // alert states
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);

        const res = await axios.get(
          "https://mri-production-7e28.up.railway.app/api/doctor/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dashboard = res.data.data;

        console.log("DASHBOARD DATA:", dashboard);

        setData(dashboard);
        setReports(dashboard?.recentReports || []);

      } catch (err) {
        console.log("FETCH ERROR:", err.response?.data || err.message);

        setMessage("Failed to load dashboard");
        setSuccess(false);
        setShowAlert(true);

        setTimeout(() => setShowAlert(false), 3000);

      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  // Add Note
  async function addNote() {
    if (!note.trim()) {
      setSuccess(false);
      setMessage("Please write a note first");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      await axios.post(
        "https://mri-production-7e28.up.railway.app/api/doctor/notes",
        { note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setMessage("Note added successfully");
      setNote("");
    } catch (err) {
      console.log(err.response?.data || err.message);

      setSuccess(false);
      setMessage("Failed to save note");
    } finally {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mt-10 mb-6">
          <h2 className="text-2xl font-bold">
            Welcome back, <span className="text-blue-500">Doctor 👋</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Overview of patient analyses and medical notes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <Card title="Total Patients" value={data?.patientsCount || 0} />
          <Card title="Tumors Detected" value={data?.tumorsDetected || 0} />
          <Card title="Average Accuracy" value={data?.averageAccuracy || "0%"} />
          <Card
            title="Last Updated"
            value={
              data?.lastUpdated
                ? new Date(data.lastUpdated).toLocaleDateString()
                : "--"
            }
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-gray-100">

          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Recent Reports</h3>
            <button className="text-blue-500 text-sm hover:underline">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">

              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Tumor</th>
                  <th className="p-3 text-center">Confidence</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : (reports || []).length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">
                      No Reports Yet
                    </td>
                  </tr>
                ) : (
                  reports.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50 transition">

                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                            {p.patientName ? p.patientName.charAt(0) : "?"}
                          </div>
                          <span className="font-medium">{p.patientName}</span>
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        {p.date ? new Date(p.date).toLocaleDateString() : "--"}
                      </td>

                      <td className="p-3 text-center">{p.tumorType}</td>

                      <td className="p-3 text-center">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                          {p.confidence}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-xs">
                          View
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold text-lg mb-4">Add Doctor Notes</h3>

          <textarea
            rows={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />

          <button
            onClick={addNote}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl text-sm"
          >
            Save Note
          </button>
        </div>

        {/* Alert */}
        {showAlert && (
          <div
            className={`fixed bottom-5 right-5 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-white
            ${success ? "bg-blue-500" : "bg-red-500"}`}
          >
            {success ? <FaCheckCircle /> : <FaTimesCircle />}
            <span className="text-sm">{message}</span>
          </div>
        )}

      </div>
    </>
  );
}

/* Card Component */
function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
      <p className="text-gray-500 text-sm mb-2">{title}</p>
      <h3 className="text-2xl font-bold text-blue-500">{value}</h3>
    </div>
  );
}