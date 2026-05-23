import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaCamera } from "react-icons/fa";
import NavRole from "../../NavRole/NavRole";

export default function ProfilePatient() {
  const BASE_URL = "https://mri-production-7e28.up.railway.app";
  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

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

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // ✅ GET PROFILE
  useEffect(() => {
    async function getProfile() {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/patient/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.data;

        setProfile({
          username: data.username,
          email: data.email,
          image: data.image
            ? `${BASE_URL}/${data.image}`
            : "",
        });
      } catch (err) {
        console.log(err);
      }
    }

    getProfile();
  }, []);

  // ✅ UPDATE PROFILE
  async function handleUpdateProfile() {
    try {
      await axios.put(
        `${BASE_URL}/api/patient/profile`,
        {
          username: profile.username,
          email: profile.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating profile ❌");
    }
  }

  // ✅ UPLOAD IMAGE
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
          },
        }
      );

      const img = res.data.data.profileImage;

      setProfile((prev) => ({
        ...prev,
        image: img ? `${BASE_URL}/${img}` : "",
      }));

      setMessage("Image updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.log(err);
      setMessage("Image upload failed");
    }
  }

  // ✅ CHANGE PASSWORD
  async function handlePassword() {
    try {
      await axios.put(
        `${BASE_URL}/api/patient/profile/change-password`,
        password,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Password changed successfully");

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Password change failed");
    }
  }

  return (
    <>
      <NavRole />

      <div className="min-h-screen bg-[#F5F7FB] p-8 flex flex-col items-center mt-10">

        {/* PROFILE CARD */}
        <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow border border-blue-200">

          {/* IMAGE */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <img
              src={profile.image || defaultImage}
              className="w-28 h-28 rounded-full object-cover"
              onError={(e) => (e.target.src = defaultImage)}
            />

            <label className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full cursor-pointer">
              <FaCamera className="text-white text-sm" />
              <input type="file" hidden onChange={handleImage} />
            </label>
          </div>

          {/* TITLE */}
          <h2 className="font-semibold mb-4">
            Personal Information
          </h2>

          {/* INPUTS */}
          <div className="space-y-3">

            <div className="flex items-center border p-2 rounded-lg">
              <FaUser className="mr-2 text-gray-400" />
              <input
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

            <div className="flex items-center border p-2 rounded-lg">
              <FaEnvelope className="mr-2 text-gray-400" />
              <input
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

          {/* BUTTONS */}
          <div className="flex justify-center gap-3 mt-6">

            <button
              onClick={handleUpdateProfile}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>

          </div>

        </div>

        {/* PASSWORD */}
        <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow border border-blue-200 mt-6">

          <h2 className="font-semibold mb-4">
            Change Password
          </h2>

          <div className="space-y-3">

            <input
              type="password"
              placeholder="Current Password"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  currentPassword: e.target.value,
                })
              }
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="password"
              placeholder="New Password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  newPassword: e.target.value,
                })
              }
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={password.confirmNewPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  confirmNewPassword: e.target.value,
                })
              }
              className="w-full border p-2 rounded-lg"
            />

          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handlePassword}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Update Password
            </button>
          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="mt-6 bg-red-600 text-white px-10 py-2 rounded-lg hover:bg-red-700"
        >
          Log Out
        </button>

        {/* MESSAGE */}
        {message && (
          <div className="fixed bottom-6 right-6 bg-white border border-blue-200 text-blue-700 px-5 py-3 rounded-xl shadow-lg">
            {message}
          </div>
        )}

      </div>
    </>
  );
}
