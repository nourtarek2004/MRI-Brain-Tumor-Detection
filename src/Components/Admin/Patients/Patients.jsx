import React from 'react'

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSearch, FaEye } from "react-icons/fa";
import NavRole from "../../NavRole/NavRole";

export default function Patients() {
  const token = localStorage.getItem("token");

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchPatients() {
    try {
      const res = await axios.get(
        "https://mri-production-7e28.up.railway.app/api/admin/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) =>
      `${patient.username} ${patient.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [patients, search]);

  return (
    <>
      <NavRole />

      <div className="bg-[#F5F7FB] min-h-screen p-4 md:p-8">

        <div className="mt-10 mb-6">
          <h1 className="text-3xl font-bold">
            Patients
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all patients.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Patient</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Last Scan</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6">
                    Loading...
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="border-t"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={patient.profileImage}
                          className="w-10 h-10 rounded-full"
                          alt=""
                        />

                        <span>{patient.username}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {patient.email}
                    </td>

                    <td className="p-4">
                      {patient.lastScan
                        ? new Date(
                            patient.lastScan
                          ).toLocaleDateString()
                        : "No Scan"}
                    </td>

                    <td className="p-4 text-center">
                      <Link
                        to={`/admin/patient/${patient._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                      >
                        <FaEye />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
