
import resetImg from "../../assets/reset2.png"; 
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  async function handleReset(values) {
    try {
      const response = await axios.post(
        `https://mri-backend-api-production-4dd1.up.railway.app/users/reset-password/${token}`,
        values,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setSubmitStatus("success");
        setSubmitMessage("Password updated successfully! You can now log in 🎉");
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setSubmitStatus("validation");
          setSubmitMessage("Invalid password. Please check the requirements.");
        } 
        else if (error.response.status === 401) {
          setSubmitStatus("invalid");
          setSubmitMessage("Invalid or expired reset link.");
        } 
        else {
          setSubmitStatus("server");
          setSubmitMessage("Server error. Please try again later.");
        }
      } else {
        setSubmitStatus("network");
        setSubmitMessage("Network error. Please check your internet connection.");
      }
    }
  }

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmedPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmedPassword: "",
    },
    validationSchema,
    onSubmit: handleReset,
  });

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 pt-24">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-10">

        {/* Image */}
        <div className="flex justify-center mb-6 mt-6">
          <img src={resetImg} alt="Create new password" className="w-48" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Create new password
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Your new password must be different from previously used passwords.
        </p>

        {/* رسالة الحالة */}
        {submitStatus && (
          <div
            className={`mb-5 flex items-center gap-3 p-4 rounded-xl border text-sm
              ${
                submitStatus === "success"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : submitStatus === "validation"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
          >
            {submitStatus === "success" && <FaCheckCircle className="text-blue-600 text-lg" />}
            {submitStatus === "validation" && <FaTimesCircle className="text-yellow-600 text-lg" />}
            {(submitStatus === "invalid" || submitStatus === "server" || submitStatus === "network") && (
              <FaTimesCircle className="text-red-600 text-lg" />
            )}
            <span>{submitMessage}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={formik.handleSubmit}>

          {/* New Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              name="confirmedPassword"
              value={formik.values.confirmedPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formik.touched.confirmedPassword && formik.errors.confirmedPassword && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.confirmedPassword}</div>
          )}

          {/* Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Reset password
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Back to{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
