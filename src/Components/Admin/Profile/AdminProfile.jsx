import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

import NavRole from "../../NavRole/NavRole";

export default function AdminProfile() {
  const BASE_URL = "https://mri-production-7e28.up.railway.app";

  const token = localStorage.getItem("token");

  const adminImage =
    "https://cdn-icons-png.flaticon.com/512/6997/6997662.png";

  const [profile, setProfile] = useState({
    username: "",
    email: "",
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

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, []);

  async function getProfile() {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile({
        username:
          res.data?.data?.fullName ||
          res.data?.data?.username ||
          "",
        email: res.data?.data?.email || "",
      });
    } catch (err) {
      console.error(err);

      showAlert(
        "error",
        err.response?.data?.message ||
          "Failed to load profile"
      );
    }
  }

  async function handleUpdateProfile() {
    if (!profile.email.trim()) {
      showAlert("error", "Email is required");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/profile`,
        {
          username: profile.username,
          email: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProfile({
        username:
          res.data?.data?.fullName ||
          profile.username,
        email:
          res.data?.data?.email ||
          profile.email,
      });

      showAlert(
        "success",
        res.data?.message ||
          "Profile updated successfully"
      );
    } catch (err) {
      console.error(err);

      showAlert(
        "error",
        err.response?.data?.message ||
          "Update failed"
      );
    }
  }

  async function handlePassword() {
    if (
      !password.currentPassword ||
      !password.newPassword ||
      !password.confirmNewPassword
    ) {
      showAlert(
        "error",
        "Please fill all password fields"
      );
      return;
    }

    if (
      password.newPassword !==
      password.confirmNewPassword
    ) {
      showAlert(
        "error",
        "Passwords do not match"
      );
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/password`,
        {
          currentPassword:
            password.currentPassword,
          newPassword:
            password.newPassword,
          confirmNewPassword:
            password.confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showAlert(
        "success",
        res.data?.message ||
          "Password updated successfully"
      );

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.error(
        err.response?.data || err
      );

      showAlert(
        "error",
        err.response?.data?.message ||
          "Password update failed"
      );
    }
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <>
      <NavRole />

      <div className="min-h-screen bg-[#F5F7FB] flex flex-col items-center py-10 mt-10">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-blue-100 p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={adminImage}
                alt="admin"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow"
              />

              <div className="absolute bottom-1 right-1 bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg">
                <FaUserShield />
              </div>
            </div>
          </div>

          <h2 className="text-center font-bold text-xl text-gray-700 mb-6">
            Personal Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">
              <FaUser className="text-gray-400 mr-3" />

              <input
                type="text"
                placeholder="Full Name"
                value={profile.username}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    username: e.target.value,
                  })
                }
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">
              <FaEnvelope className="text-gray-400 mr-3" />

              <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
                className="w-full outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateProfile}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            Save Changes
          </button>
        </div>

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
                      e.target.value,
                  })
                }
                className="w-full outline-none"
              />
            </div>

            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3">
              <FaLock className="text-gray-400 mr-3" />

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
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            Update Password
          </button>
        </div>

        <button
          onClick={logout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-10 py-3 rounded-xl flex items-center gap-2 font-semibold"
        >
          <FaSignOutAlt />
          Log Out
        </button>

        {alert.show && (
          <div
            className={`fixed bottom-5 right-5 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white z-50 ${
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

            <span className="font-medium">
              {alert.text}
            </span>
          </div>
        )}
      </div>
    </>
  );
}