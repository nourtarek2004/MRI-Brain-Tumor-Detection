import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import NavRole from "../../NavRole/NavRole";

export default function PatientDetails() {

  const { id } = useParams();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Note State
  const [note, setNote] = useState("");

  // Alert State
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });

  // =========================
  // Get Patient Details
  // =========================
  async function getDetails() {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `https://mri-production-7e28.up.railway.app/api/doctor/patients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data.data);

    } catch (err) {

      console.log(err.response?.data || err);

      setError("Failed to load patient details ❌");

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    if (id) {
      getDetails();
    }

  }, [id]);

  // =========================
  // Add Note
  // =========================
  async function addNote() {

    if (!note.trim()) {

      setAlert({
        show: true,
        message: "Please write a note first",
        type: "error",
      });

      setTimeout(() => {

        setAlert({
          show: false,
          message: "",
          type: "",
        });

      }, 3000);

      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "https://mri-production-7e28.up.railway.app/api/doctor/notes",
        {
          note: note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNote("");

      setAlert({
        show: true,
        message: "Note saved successfully",
        type: "success",
      });

      setTimeout(() => {

        setAlert({
          show: false,
          message: "",
          type: "",
        });

      }, 3000);

    } catch (err) {

      console.log(err.response?.data || err);

      setAlert({
        show: true,
        message: "Failed to save note",
        type: "error",
      });

      setTimeout(() => {

        setAlert({
          show: false,
          message: "",
          type: "",
        });

      }, 3000);
    }
  }

  // =========================
  // Loading
  // =========================
  if (loading) {

    return (
      <p className="p-6 text-center">
        Loading...
      </p>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {

    return (
      <p className="p-6 text-center text-red-500">
        {error}
      </p>
    );
  }

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen py-8 px-4 md:px-10">

        <div className="max-w-6xl mx-auto space-y-8 my-14">

          {/* ========================= */}
          {/* Patient Profile */}
          {/* ========================= */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center gap-6">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="patient"
              className="w-24 h-24 rounded-full border object-cover"
            />

            <div className="text-center md:text-left">

              <h2 className="text-xl font-semibold">

                {data?.patientInfo?.name}

              </h2>

              <p className="text-gray-500">

                ID: {data?.patientInfo?.id}

              </p>

              <p className="text-gray-500">

                Last Scan:
                {" "}
                {data?.patientInfo?.lastScan
                  ? new Date(
                      data.patientInfo.lastScan
                    ).toLocaleDateString()
                  : "--"}

              </p>

            </div>

          </div>

          {/* ========================= */}
          {/* AI Result */}
          {/* ========================= */}
          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h3 className="font-semibold mb-6 text-lg">
              AI Analysis Result
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Tumor */}
              <div className="bg-blue-50 p-4 rounded-xl text-center">

                <p className="text-sm text-gray-500">
                  Tumor Type
                </p>

                <p className="font-semibold text-blue-600 mt-1">

                  {data?.aiAnalysisResult?.tumorType || "--"}

                </p>

              </div>

              {/* Confidence */}
              <div className="bg-yellow-50 p-4 rounded-xl text-center">

                <p className="text-sm text-gray-500">
                  Confidence
                </p>

                <p className="font-semibold text-yellow-600 mt-1">

                  {data?.aiAnalysisResult?.confidence || "--"}

                </p>

              </div>

              {/* Status */}
              <div className="bg-red-50 p-4 rounded-xl text-center">

                <p className="text-sm text-gray-500">
                  Status
                </p>

                <p className="font-semibold text-red-600 mt-1">

                  {data?.aiAnalysisResult?.status || "--"}

                </p>

              </div>

            </div>

            <p className="mt-6 text-gray-600 leading-relaxed text-center md:text-left">

              {data?.aiAnalysisResult?.description ||
                "No description available"}

            </p>

          </div>

          {/* ========================= */}
          {/* Notes */}
          {/* ========================= */}
          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h3 className="font-semibold mb-4 text-lg">
              Add Doctor Notes
            </h3>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write notes..."
              rows={5}
              className="w-full border rounded-xl p-4 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={addNote}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition"
            >
              Save Note
            </button>

          </div>

        </div>

        {/* ========================= */}
        {/* Alert */}
        {/* ========================= */}
        {alert.show && (

          <div
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white animate-bounce
            ${
              alert.type === "success"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
          >

            {alert.type === "success" ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaTimesCircle className="text-xl" />
            )}

            <span className="text-sm md:text-base">

              {alert.message}

            </span>

          </div>

        )}

      </div>
    </>
  );
}