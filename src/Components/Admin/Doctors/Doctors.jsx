import React from 'react'

import { useEffect, useMemo, useState ,useRef} from "react";
import axios from "axios";
import NavRole from "../../NavRole/NavRole";
import {FaTrash,FaEnvelope, FaSearch,FaEdit, FaPlus, FaCheckCircle,FaTimesCircle,FaExclamationCircle  } from "react-icons/fa";

export default function Doctors() {
  const token = localStorage.getItem("token");

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);

const [selectedDoctorId, setSelectedDoctorId] = useState("");

const [doctorForm, setDoctorForm] = useState({
  username: "",
  email: "",
  password: "",
  specialization: "",
});

const alertRef = useRef(false);

function showAlert(type, message) {
  if (!message) return;

  if (alertRef.current) return; // يمنع التكرار
  alertRef.current = true;

  setAlert({ type, message });

  setTimeout(() => {
    setAlert(null);
    alertRef.current = false;
  }, 3000);
}

  async function fetchDoctors() {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://mri-production-7e28.up.railway.app/api/admin/doctors",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDoctors(res.data.data || []);
    } catch (err) {
      console.log(err);
      showAlert("error", "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function deleteDoctor(id) {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(
        `https://mri-production-7e28.up.railway.app/api/admin/doctors/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showAlert("success", "Doctor deleted successfully");
      fetchDoctors();
    } catch (err) {
      console.log(err);
      showAlert("error", "Delete failed");
    }
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const username = doctor.user?.username || "";
      const email = doctor.user?.email || "";

      return (
        username.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [doctors, search]);
function handleCreateDoctor() {
  setDoctorForm({
    username: "",
    email: "",
    password: "",
    specialization: "",
  });

  setShowCreateModal(true);
}
 

  function handleEditDoctor(doctor) {
  setSelectedDoctorId(doctor.user?._id);

  setDoctorForm({
    username: doctor.user?.username || "",
    email: doctor.user?.email || "",
    password: "",
    specialization: doctor.specialization || "",
  });

  setShowEditModal(true);
}  
async function createDoctor(e) {
  e.preventDefault();

  try {
    await axios.post(
      "https://mri-production-7e28.up.railway.app/api/admin/doctors",
      {
        username: doctorForm.username,
        email: doctorForm.email,
        password: doctorForm.password,
        specialization: doctorForm.specialization,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    showAlert("success", "Doctor created successfully");

    setShowCreateModal(false);

    fetchDoctors();
  } catch (err) {
    console.log(err);

    showAlert(
      "error",
      err.response?.data?.message || "Create failed"
    );
  }
}

async function updateDoctor(e) {
  e.preventDefault();

  try {
    await axios.put(
      `https://mri-production-7e28.up.railway.app/api/admin/doctors/${selectedDoctorId}`,
      {
        username: doctorForm.username,
        email: doctorForm.email,
        specialization: doctorForm.specialization,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    showAlert("success", "Doctor updated successfully");

    setShowEditModal(false);

    fetchDoctors();
  } catch (err) {
    console.log(err);

    
  }
}
      

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen p-4 md:p-8">
        {/* Header */}
        <div className="mt-10 mb-6">
          <h1 className="text-3xl font-bold">Manage Doctors</h1>
          <p className="text-gray-500 mt-2">
            View, create and manage doctors.
          </p>
        </div>

        {/* Search + Create */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative w-full md:w-2/3">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            onClick={handleCreateDoctor}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >
            <FaPlus />
            Create Doctor
          </button>
        </div>

        {/* TABLE */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full table-fixed">
            {/* HEADER LEFT */}
            <thead className="bg-gray-100 text-gray-600">
              <tr className="text-left">
                <th className="w-[6%] py-4 pl-4">#</th>
                <th className="w-[26%]">Doctor</th>
                <th className="w-[25%]">Email</th>
                <th className="w-[18%]">Specialization</th>
                <th className="w-[12%]">Status</th>
                <th className="w-[13%] text-center">Actions</th>
              </tr>
            </thead>

            {/* BODY LEFT */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-left p-8">
                    Loading...
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-left p-8 text-gray-400">
                    No doctors found
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor, index) => (
                  <tr
                    key={doctor._id}
                    className="border-t hover:bg-gray-50 text-left"
                  >
                    {/* # */}
                    <td className="py-4 pl-4">{index + 1}</td>

                    {/* Doctor */}
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={doctor.user?.profileImage}
                          className="w-10 h-10 rounded-full border"
                          alt=""
                        />
                        <span>{doctor.user?.username}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="truncate">
                      {doctor.user?.email}
                    </td>

                    {/* Specialization */}
                    <td className="truncate">
                      {doctor.specialization || "Not Assigned"}
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          doctor.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {doctor.status || "pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEditDoctor(doctor)}
                         
                          className="bg-yellow-500 hover:bg-yellow-600 text-white w-9 h-9 rounded-lg flex items-center justify-center"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() =>
                            deleteDoctor(doctor.user?._id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white w-9 h-9 rounded-lg flex items-center justify-center"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE LEFT ALIGN */}
        <div className="lg:hidden space-y-4 mt-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-sm p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={doctor.user?.profileImage}
                  className="w-12 h-12 rounded-full border"
                  alt=""
                />

                <div className="text-left">
                  <h3 className="font-semibold">
                    {doctor.user?.username}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {doctor.specialization || "Not Assigned"}
                  </p>
                </div>
              </div>

              <p className="text-sm mt-3 flex items-center gap-2">
                <FaEnvelope />
                {doctor.user?.email}
              </p>

                      <div className="flex items-center gap-3 mt-4">
            
            <button onClick={() => handleEditDoctor(doctor)}
              className="flex items-center justify-center gap-2 flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl transition">
              <FaEdit />
              <span className="text-sm">Edit</span>
            </button>

            <button onClick={() => deleteDoctor(doctor.user?._id)}
              className="flex items-center justify-center gap-2 flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition">
              <FaTrash />
              <span className="text-sm">Delete</span>
            </button>

          </div>
            </div>
          ))}
        </div>
        {showCreateModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <form
      onSubmit={createDoctor}
      className="bg-white p-6 rounded-2xl w-[95%] max-w-md"
    >
      <h2 className="text-xl font-bold mb-4">Create Doctor</h2>

      <input
        type="text"
        placeholder="Username"
        value={doctorForm.username}
        onChange={(e) =>
          setDoctorForm({
            ...doctorForm,
            username: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={doctorForm.email}
        onChange={(e) =>
          setDoctorForm({
            ...doctorForm,
            email: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={doctorForm.password}
        onChange={(e) =>
          setDoctorForm({
            ...doctorForm,
            password: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
        required
      />

      <input
        type="text"
        placeholder="Specialization"
        value={doctorForm.specialization}
        onChange={(e) =>
          setDoctorForm({
            ...doctorForm,
            specialization: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-4"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
        >
          Create
        </button>

        <button
          type="button"
          onClick={() => setShowCreateModal(false)}
          className="flex-1 bg-gray-300 py-3 rounded-xl"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}
{showEditModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <form
      onSubmit={updateDoctor}
      className="bg-white p-6 rounded-2xl w-[95%] max-w-md"
    >
      <h2 className="text-xl font-bold mb-4">Edit Doctor</h2>

      <input
        type="text"
        value={doctorForm.username}
        onChange={(e) =>
          setDoctorForm({
            ...doctorForm,
            username: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
      />

      <input
        type="email"
        value={doctorForm.email}
        onChange={(e) =>
          setDoctorForm({
            ...doctorForm,
            email: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-3"
      />

      <input
        type="text"
        value={doctorForm.specialization}
        onChange={(e) =>
          setDoctorForm({
            ...doctorForm,
            specialization: e.target.value,
          })
        }
        className="w-full border p-3 rounded-xl mb-4"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-yellow-500 text-white py-3 rounded-xl"
        >
          Update
        </button>

        <button
          type="button"
          onClick={() => setShowEditModal(false)}
          className="flex-1 bg-gray-300 py-3 rounded-xl"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}
    {alert?.message && (
        <div
          className={`
            fixed bottom-6 right-6
            min-w-[320px] px-5 py-4 rounded-2xl shadow-2xl
            flex items-center gap-3 text-white z-50
            ${alert.type === "success" ? "bg-blue-600" : "bg-red-500"}
          `}
        >
          {alert.type === "success" ? (
            <FaCheckCircle className="text-xl" />
          ) : (
            <FaExclamationCircle className="text-xl" />
          )}

          <span className="font-medium">{alert.message}</span>
        </div>
      )}
      </div>
    </>
  );
}