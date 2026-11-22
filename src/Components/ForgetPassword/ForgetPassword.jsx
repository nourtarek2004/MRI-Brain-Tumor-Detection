import forgetImg from "../../assets/reset.png";
import { FaEnvelope, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgetPassword() {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  async function handleForget(values) {
    try {
      const response = await axios.post(
        "https://mri-production-7e28.up.railway.app/users/forget-password",
        values,
        { headers: { "Content-Type": "application/json" } }
      ); 

      if (response.status === 200) {
        setSubmitStatus("success");
        setSubmitMessage(" this email exists, a reset link has been sent 📩");
      } 

    } catch (error) {
      if (error.response && error.response.status === 400) {
        setSubmitStatus("error");
        setSubmitMessage("Email is required.");
      } else {
        setSubmitStatus("error");
        setSubmitMessage("Something went wrong. Please try again.");
      }
    }
  }

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: handleForget,
  });

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 pt-24">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-10">

        {/* Image */}
        <div className="flex justify-center mb-6 mt-6">
          <img src={forgetImg} alt="Reset password" className="w-48" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Reset password
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          We will send you an email with instructions to reset your password.
        </p>

       
        {submitStatus && (
          <div
            className={`mb-5 flex items-center gap-3 p-4 rounded-xl border text-sm
              ${
                submitStatus === "success"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
          >
            {submitStatus === "success" ? (
              <FaCheckCircle className="text-blue-600 text-lg" />
            ) : (
              <FaTimesCircle className="text-red-600 text-lg" />
            )}
            <span>{submitMessage}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={formik.handleSubmit}>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
          )}

          {/* Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Send email
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
