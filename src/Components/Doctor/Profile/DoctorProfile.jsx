import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaStethoscope,
  FaHospital,
  FaLock,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt
} from "react-icons/fa";

import NavRole from "../../NavRole/NavRole";

export default function ProfileDoctor() {

  const BASE_URL =
    "https://mri-production-7e28.up.railway.app";

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const token = localStorage.getItem("token");

  // ================= STATES =================

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    specialization: "",
    workplace: "",
    profileImage: ""
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    text: ""
  });

  // ================= ALERT =================

  function showAlert(type, text) {

    setAlert({
      show: true,
      type,
      text
    });

    setTimeout(() => {
      setAlert({
        show: false,
        type: "",
        text: ""
      });
    }, 3000);
  }

  // ================= GET PROFILE =================

  useEffect(() => {

    async function getProfile() {

      try {

        const res = await axios.get(
          `${BASE_URL}/api/doctor/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = res.data.data;

        setProfile({
          name: data.name || "",
          email: data.email || "",
          specialization:
            data.specialization || "",
          workplace: data.workplace || "",
          profileImage:
            data.profileImage || ""
        });

      } catch (err) {

        console.log(err);

        showAlert(
          "error",
          "Failed to load profile"
        );
      }
    }

    getProfile();

  }, []);

  // ================= IMAGE UPLOAD =================

  async function handleImageChange(e) {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("profileImage", file);

    try {

      const res = await axios.put(
        `${BASE_URL}/api/doctor/profile/uploadImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      console.log(res.data);

      const imageUrl =
        res.data.data.profileImage;

      setProfile((prev) => ({
        ...prev,
        profileImage: imageUrl
      }));

      showAlert(
        "success",
        "Image updated successfully"
      );

    } catch (err) {

      console.log(err);

      showAlert(
        "error",
        "Image upload failed"
      );
    }
  }

  // ================= UPDATE PROFILE =================

  async function handleUpdateProfile() {

    try {

      const dataToSend = {
        name: profile.name,
        email: profile.email,
        specialization:
          profile.specialization,
        workplace: profile.workplace
      };

      await axios.put(
        `${BASE_URL}/api/doctor/profile`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      showAlert(
        "success",
        "Profile updated successfully"
      );

    } catch (err) {

      console.log(err);

      showAlert(
        "error",
        "Update failed"
      );
    }
  }

  // ================= PASSWORD =================

  async function handlePassword() {

    try {

      await axios.put(
        `${BASE_URL}/api/doctor/profile/change-password`,
        password,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      showAlert(
        "success",
        "Password updated successfully"
      );

      setPassword({
        currentPassword: "",
        newPassword: ""
      });

    } catch (err) {

      console.log(err);

      showAlert(
        "error",
        "Password update failed"
      );
    }
  }

  return (
    <>
      <NavRole />

      <div className="min-h-screen bg-[#F5F7FB] flex flex-col items-center py-10 mt-10">

        {/* PROFILE CARD */}

        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-blue-100 p-8">

          {/* IMAGE */}

          <div className="flex justify-center mb-6">

            <div className="relative">

              <img
                src={
                  profile.profileImage ||
                  defaultImage
                }
                alt="doctor"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />

              <label className="absolute bottom-1 right-1 bg-blue-500 hover:bg-blue-600 transition text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer shadow-lg">

                <FaCamera />

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />

              </label>

            </div>

          </div>

          {/* TITLE */}

          <h2 className="text-center font-bold text-xl text-gray-700 mb-6">

            Personal Information

          </h2>

          {/* INPUTS */}

          <div className="space-y-4">

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">

              <FaUser className="text-gray-400 mr-3" />

              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value
                  })
                }
                placeholder="Name"
                className="w-full outline-none"
              />

            </div>

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">

              <FaEnvelope className="text-gray-400 mr-3" />

              <input
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value
                  })
                }
                placeholder="Email"
                className="w-full outline-none"
              />

            </div>

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">

              <FaStethoscope className="text-gray-400 mr-3" />

              <input
                value={
                  profile.specialization
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    specialization:
                      e.target.value
                  })
                }
                placeholder="Specialization"
                className="w-full outline-none"
              />

            </div>

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">

              <FaHospital className="text-gray-400 mr-3" />

              <input
                value={profile.workplace}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    workplace:
                      e.target.value
                  })
                }
                placeholder="Workplace"
                className="w-full outline-none"
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={handleUpdateProfile}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded-xl font-semibold"
          >
            Save Changes
          </button>

        </div>

        {/* PASSWORD */}

        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-blue-100 p-8 mt-6">

          <h2 className="text-center font-bold text-xl text-gray-700 mb-6">

            Change Password

          </h2>

          <div className="space-y-4">

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">

              <FaLock className="text-gray-400 mr-3" />

              <input
                type="password"
                placeholder="Current Password"
                value={
                  password.currentPassword
                }
                onChange={(e) =>
                  setPassword({
                    ...password,
                    currentPassword:
                      e.target.value
                  })
                }
                className="w-full outline-none"
              />

            </div>

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">

              <FaLock className="text-gray-400 mr-3" />

              <input
                type="password"
                placeholder="New Password"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    newPassword:
                      e.target.value
                  })
                }
                className="w-full outline-none"
              />

            </div>

          </div>

          <button
            onClick={handlePassword}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 transition text-white py-3 rounded-xl font-semibold"
          >
            Update Password
          </button>

        </div>

        {/* LOGOUT */}

        <button
          onClick={() => {
            localStorage.removeItem("token");

            window.location.href =
              "/login";
          }}
          className="mt-6 bg-red-500 hover:bg-red-600 transition text-white px-10 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >

          <FaSignOutAlt />

          Log Out

        </button>

        {/* ALERT */}

        {alert.show && (

          <div
            className={`fixed top-5 right-5 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white z-50 transition-all duration-300

            ${
              alert.type === "success"
                ? "bg-blue-500"
                : "bg-red-500"
            }
          `}
          >

            {alert.type === "success" ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaTimesCircle className="text-xl" />
            )}

            <span className="font-medium">
              {alert.text}
            </span>

          </div>

        )}

      </div>
    </>
  );
}