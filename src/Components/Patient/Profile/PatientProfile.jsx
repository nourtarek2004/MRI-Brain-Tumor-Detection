import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";

import NavRole from "../../NavRole/NavRole";

export default function ProfilePatient() {
  const BASE_URL = "https://mri-production-7e28.up.railway.app";

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    image: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    text: "",
  });

  // ================= ALERT =================

  function showAlert(type, text) {
    setAlert({
      show: true,
      type,
      text,
    });

    setTimeout(() => {
      setAlert({
        show: false,
        type: "",
        text: "",
      });
    }, 3000);
  }

  // ================= GET PROFILE =================

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/patient/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.data;

        setProfile({
          username: data.username || "",
          email: data.email || "",

          //  IMPORTANT FIX
          image:
            data.profileImage ||
            data.image ||
            "",
        });
      } catch (err) {
        console.log(err);

        showAlert("error", "Failed to load profile");
      }
    }

    getProfile();
  }, []);

  // ================= UPDATE PROFILE =================

  async function handleUpdateProfile() {
    try {
      await axios.put(
        `${BASE_URL}/api/patient/profile`,
        {
          username: profile.username,
          email: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlert("success", "Profile updated successfully");
    } catch (err) {
      console.log(err);

      showAlert("error", "Error updating profile");
    }
  }

  // ================= UPLOAD IMAGE =================

  async function handleImage(e) {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("profileImage", file);

    try {
      const res = await axios.put(
        `${BASE_URL}/api/patient/profile/uploadImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);

      const imageUrl =
        res.data.data.profileImage;

      // ✅ SAVE IMAGE DIRECTLY
      setProfile((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      showAlert("success", "Image updated successfully");
    } catch (err) {
      console.log(err);

      showAlert("error", "Image upload failed");
    }
  }

  // ================= CHANGE PASSWORD =================

  async function handlePassword() {
    if (
      password.newPassword !==
      password.confirmNewPassword
    ) {
      return showAlert(
        "error",
        "Passwords do not match"
      );
    }

    try {
      await axios.put(
        `${BASE_URL}/api/patient/profile/change-password`,
        password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlert(
        "success",
        "Password changed successfully"
      );

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.log(err);

      showAlert("error", "Password change failed");
    }
  }

  // ================= JSX =================

  return (
    <>
      <NavRole />

      <div className="min-h-screen bg-[#F5F7FB] p-8 flex flex-col items-center mt-10">

        {/* PROFILE CARD */}

        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow border border-blue-100">

          {/* IMAGE */}

          <div className="relative w-32 h-32 mx-auto mb-6">

            <img
              src={profile.image || defaultImage}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />

            <label className="absolute bottom-1 right-1 bg-blue-500 hover:bg-blue-600 p-3 rounded-full cursor-pointer shadow-lg transition">

              <FaCamera className="text-white text-sm" />

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />

            </label>

          </div>

          {/* TITLE */}

          <h2 className="text-xl font-bold text-gray-700 mb-5">
            Personal Information
          </h2>

          {/* INPUTS */}

          <div className="space-y-4">

            <div className="flex items-center border border-gray-200 p-3 rounded-xl">

              <FaUser className="mr-3 text-gray-400" />

              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    username: e.target.value,
                  })
                }
                className="w-full outline-none"
                placeholder="Username"
              />

            </div>

            <div className="flex items-center border border-gray-200 p-3 rounded-xl">

              <FaEnvelope className="mr-3 text-gray-400" />

              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
                className="w-full outline-none"
                placeholder="Email"
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

        {/* PASSWORD CARD */}

        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow border border-blue-100 mt-6">

          <h2 className="text-xl font-bold text-gray-700 mb-5">
            Change Password
          </h2>

          <div className="space-y-4">

            <div className="flex items-center border border-gray-200 p-3 rounded-xl">

              <FaLock className="mr-3 text-gray-400" />

              <input
                type="password"
                placeholder="Current Password"
                value={password.currentPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    currentPassword:
                      e.target.value,
                  })
                }
                className="w-full outline-none"
              />

            </div>

            <div className="flex items-center border border-gray-200 p-3 rounded-xl">

              <FaLock className="mr-3 text-gray-400" />

              <input
                type="password"
                placeholder="New Password"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    newPassword:
                      e.target.value,
                  })
                }
                className="w-full outline-none"
              />

            </div>

            <div className="flex items-center border border-gray-200 p-3 rounded-xl">

              <FaLock className="mr-3 text-gray-400" />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={
                  password.confirmNewPassword
                }
                onChange={(e) =>
                  setPassword({
                    ...password,
                    confirmNewPassword:
                      e.target.value,
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

            window.location.href = "/login";
          }}
          className="mt-6 bg-red-500 hover:bg-red-600 transition text-white px-10 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >

          <FaSignOutAlt />

          Log Out

        </button>

        {/* ALERT */}

        {alert.show && (

          <div
            className={`fixed top-6 right-6 px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 text-white z-50 transition-all duration-300
              
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
