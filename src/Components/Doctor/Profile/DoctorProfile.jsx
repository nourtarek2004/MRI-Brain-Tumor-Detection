import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaStethoscope,
  FaHospital,
  FaLock,
  FaPen,
  FaCheck,
  FaTimes
} from "react-icons/fa";

import NavRole from "../../NavRole/NavRole";

export default function ProfileDoctor() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    specialization: "",
    workplace: "",
    profileImage: ""
  });

  const [previewImage, setPreviewImage] = useState("");
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const token = localStorage.getItem("token");

  // ================= LOAD IMAGE FROM LOCALSTORAGE =================
  useEffect(() => {
    const savedImage = localStorage.getItem("doctorImage");
    if (savedImage) {
      setPreviewImage(savedImage);
      setProfile((prev) => ({ ...prev, profileImage: savedImage }));
    }
  }, []);

  // ================= GET PROFILE =================
  useEffect(() => {
    async function getProfile() {
      try {
        const res = await axios.get(
          "https://mri-production-7e28.up.railway.app/api/doctor/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = res.data.data;

        setProfile(data);

        if (data.profileImage) {
          setPreviewImage(data.profileImage);
          localStorage.setItem("doctorImage", data.profileImage);
        }
      } catch {
        setMessage("Failed to load profile");
        setMessageType("error");
      }
    }

    getProfile();
  }, []);

  // ================= IMAGE =================
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;

      setPreviewImage(base64);

      // حفظ الصورة محليًا
      localStorage.setItem("doctorImage", base64);

      setProfile((prev) => ({
        ...prev,
        profileImage: base64
      }));
    };

    reader.readAsDataURL(file);
  }

  // ================= UPDATE PROFILE (NO IMAGE SENT) =================
  async function handleUpdateProfile() {
    try {
      const { profileImage, ...dataWithoutImage } = profile;

      await axios.put(
        "https://mri-production-7e28.up.railway.app/api/doctor/profile",
        dataWithoutImage,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Profile updated successfully");
      setMessageType("success");

      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Update failed");
      setMessageType("error");

      setTimeout(() => setMessage(""), 3000);
    }
  }

  // ================= PASSWORD =================
  async function handlePassword() {
    try {
      await axios.put(
        "https://mri-production-7e28.up.railway.app/api/doctor/profile/change-password",
        password,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Password updated successfully");
      setMessageType("success");

      setPassword({ currentPassword: "", newPassword: "" });

      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Password failed");
      setMessageType("error");

      setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <>
      <NavRole />

      <div className="min-h-screen bg-[#F5F7FB] flex flex-col items-center py-10 mt-10">

        {/* PROFILE CARD */}
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border p-6">

          {/* IMAGE */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={
                  previewImage ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="w-28 h-28 rounded-full object-cover shadow"
              />

              <label className="absolute bottom-1 right-1 bg-blue-500 text-white w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">
                <FaPen size={12} />
                <input type="file" hidden onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <h2 className="text-center font-semibold mb-5 text-gray-700">
            Personal Information
          </h2>

          {/* INPUTS */}
          <div className="space-y-3">
            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              placeholder="Name"
              className="w-full border p-2 rounded-lg"
            />

            <input
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="Email"
              className="w-full border p-2 rounded-lg"
            />

            <input
              value={profile.specialization || ""}
              onChange={(e) =>
                setProfile({ ...profile, specialization: e.target.value })
              }
              placeholder="Specialization"
              className="w-full border p-2 rounded-lg"
            />

            <input
              value={profile.workplace || ""}
              onChange={(e) =>
                setProfile({ ...profile, workplace: e.target.value })
              }
              placeholder="Workplace"
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Save
            </button>

            <button
              onClick={() => window.location.reload()}
              className="border px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border p-6 mt-6">

          <h2 className="text-center font-semibold mb-4">
            Change Password
          </h2>

          <input
            type="password"
            placeholder="Current Password"
            value={password.currentPassword}
            onChange={(e) =>
              setPassword({
                ...password,
                currentPassword: e.target.value
              })
            }
            className="w-full border p-2 rounded-lg mb-2"
          />

          <input
            type="password"
            placeholder="New Password"
            value={password.newPassword}
            onChange={(e) =>
              setPassword({
                ...password,
                newPassword: e.target.value
              })
            }
            className="w-full border p-2 rounded-lg"
          />

          <div className="flex justify-center mt-5">
            <button
              onClick={handlePassword}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("doctorImage");
            window.location.href = "/login";
          }}
          className="mt-6 bg-red-600 text-white px-8 py-2 rounded-lg"
        >
          Log Out
        </button>

        {/* ALERT */}
        {message && (
          <div
            className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow flex items-center gap-2
            ${
              messageType === "success"
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {messageType === "success" ? <FaCheck /> : <FaTimes />}
            {message}
          </div>
        )}
      </div>
    </>
  );
}