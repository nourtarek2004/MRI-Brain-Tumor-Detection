import React from 'react'

import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaUserFriends } from "react-icons/fa";

export default function ChooseDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  //  Fetch doctors
  useEffect(() => {
    async function getDoctors() {
      try {
        const res = await axios.get(
          "https://mri-production-7e28.up.railway.app/api/patient/doctors",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDoctors(res.data.data);
        setFilteredDoctors(res.data.data);
      } catch (err) {
        console.log(err);
      }
    }

    getDoctors();
  }, []);

  //  Search
  useEffect(() => {
    const filtered = doctors.filter((doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [search, doctors]);

  //  Follow / Unfollow
  async function handleFollow(id, isFollowing) {
    try {
      await axios.post(
        "https://mri-production-7e28.up.railway.app/api/patient/assigndoctor",
        { doctorId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      //  Toggle UI
      setDoctors((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, isFollowing: !isFollowing } : doc
        )
      );

      
      setMessage(
        isFollowing
          ? "Doctor unfollowed successfully"
          : "Doctor followed successfully"
      );

      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      setMessage("Something went wrong ❌");
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">
          Choose Doctors You’d Like to Connect With
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Select one or more doctors to follow and consult during your journey.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow w-[400px]">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search doctor..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg transition"
          >
            {/* Image */}
            <img
              src={doc.profileImage}
              alt=""
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />

            {/* Name */}
            <h3 className="font-semibold text-lg">{doc.name}</h3>

            {/* Specialization */}
            <p className="text-gray-500 text-sm mb-2">
              {doc.specialization || "Doctor"}
            </p>

            {/* Info */}
            <div className="flex justify-center items-center gap-3 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <FaUserFriends /> {doc.patientsCount || 0} Patients
              </span>
              <span>⭐ 5.7</span>
            </div>

            {/* Button */}
            <button
              onClick={() => handleFollow(doc.id, doc.isFollowing)}
              className={`px-5 py-2 rounded-lg text-white text-sm transition ${
                doc.isFollowing
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {doc.isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        ))}
      </div>

      {/* Continue */}
      <div className="flex justify-center mt-10">
        <button className="bg-blue-500 text-white px-10 py-3 rounded-lg shadow hover:bg-blue-600 transition" >
          ← Continue
        </button>
      </div>

      {/*  Alert */}
      {message && (
        <div className="fixed bottom-6 right-6 bg-white border border-blue-200 text-blue-700 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="text-blue-500 text-lg">✔</span>
          <span>{message}</span>
        </div>
      )}

    </div>
  );
}