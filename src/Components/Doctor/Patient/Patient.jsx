import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavRole from "../../NavRole/NavRole";

export default function Patient() {

  const [patients, setPatients] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {

    const controller = new AbortController();

    async function getPatients() {

      try {

        setLoading(true);

        const res = await axios.get(
          "https://mri-production-7e28.up.railway.app/api/doctor/patients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        setPatients(res.data.data || []);

      } catch (err) {

        console.log(err.response?.data || err);

      } finally {

        setLoading(false);

      }
    }

    getPatients();

    return () => controller.abort();

  }, [token]);

  // Filter Patients
  const filtered = useMemo(() => {

    return patients.filter((p) =>

      (p.patientName || "")
        .toLowerCase()
        .includes(searchName.toLowerCase())

      &&

      (p.tumorType || "")
        .toLowerCase()
        .includes(searchType.toLowerCase())
    );

  }, [patients, searchName, searchType]);

  return (
    <>
      <NavRole />

      <div className="min-h-screen bg-[#F5F7FB] p-4 md:p-8">

        {/* Header */}
        <div className="mb-8 mt-10">

          <h2 className="text-3xl font-bold text-gray-800">
            Patients
          </h2>

          <p className="text-gray-500 mt-1">
            Manage and review all patient scans and reports.
          </p>

        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <input
            type="text"
            placeholder="Search patient name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-200 bg-white rounded-xl p-3 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            placeholder="Search tumor type..."
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border border-gray-200 bg-white rounded-xl p-3 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm">

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">

              <tr>
                <th className="p-4">Patient</th>
                <th>Age</th>
                <th>Tumor</th>
                <th>Confidence</th>
                <th>Date</th>
                <th>Status</th>
                <th>Scan</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-10 text-gray-400"
                  >
                    Loading patients...
                  </td>
                </tr>

              ) : filtered.length === 0 ? (

                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-10 text-gray-400"
                  >
                    No patients found
                  </td>
                </tr>

              ) : (

                filtered.map((p) => (

                  <tr
                    key={p.id}
                    className="border-t text-center hover:bg-gray-50 transition"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-3 justify-center">

                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">

                          {p.patientName?.charAt(0)}

                        </div>

                        <span className="font-medium">
                          {p.patientName}
                        </span>

                      </div>

                    </td>

                    <td>{p.age || "--"}</td>

                    <td>
                      <span className="text-gray-700">
                        {p.tumorType}
                      </span>
                    </td>

                    <td>

                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">

                        {p.confidence}

                      </span>

                    </td>

                    <td>
                      {new Date(p.scanDate).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          p.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >

                        {p.status}

                      </span>

                    </td>

                    {/* Scan */}
                    <td>

                      {p.scan ? (

                        <img
                          src={p.scan}
                          alt="scan"
                          className="w-14 h-14 object-cover rounded-lg mx-auto border"
                        />

                      ) : (

                        "--"

                      )}

                    </td>

                    {/* Actions */}
                    <td>

                      <button
                        onClick={() => navigate(`/patient/${p.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-lg text-xs"
                      >
                        View Details
                      </button>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">

          {loading ? (

            <div className="text-center text-gray-400 py-10">
              Loading...
            </div>

          ) : filtered.length === 0 ? (

            <div className="text-center text-gray-400 py-10">
              No patients found
            </div>

          ) : (

            filtered.map((p) => (

              <div
                key={p.id}
                className="bg-white shadow-sm rounded-2xl p-4 space-y-3"
              >

                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">

                    {p.patientName?.charAt(0)}

                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-800">
                      {p.patientName}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {p.tumorType}
                    </p>

                  </div>

                </div>

                {p.scan && (

                  <img
                    src={p.scan}
                    alt="scan"
                    className="w-full h-40 object-cover rounded-xl border"
                  />

                )}

                <div className="text-sm text-gray-600 space-y-1">

                  <p>
                    <span className="font-medium">Age:</span> {p.age || "--"}
                  </p>

                  <p>
                    <span className="font-medium">Confidence:</span>{" "}
                    {p.confidence}
                  </p>

                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(p.scanDate).toLocaleDateString()}
                  </p>

                </div>

                <button
                  onClick={() => navigate(`/patient/${p.id}`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition"
                >
                  View Details
                </button>

              </div>

            ))
          )}

        </div>

      </div>
    </>
  );
}