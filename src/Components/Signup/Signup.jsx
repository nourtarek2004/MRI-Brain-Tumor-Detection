import registerImg from "../../assets/register.png";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";  
import { Link } from "react-router-dom";



export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [submitMessage, setSubmitMessage] = useState("");
  
  async function handleRegister(values) {
  try {
    const response = await axios.post(
      "https://mri-production-7e28.up.railway.app/users/signup",
      values,
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.status === 201) {
      setSubmitStatus("success");
      setSubmitMessage("Account created successfully! Please check your email to verify your account 📩");
      formik.resetForm();
    }

  } catch (error) {
    if (error.response) {
      if (error.response.status === 409) {
        setSubmitStatus("exists");
        setSubmitMessage("This email is already registered. Try logging in instead.");
      } 
      else if (error.response.status === 400) {
        setSubmitStatus("validation");
        setSubmitMessage("Some data is invalid. Please review your inputs.");
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
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .required("Username is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmedPassword: Yup.string()
  .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),

  role: Yup.string()
    .oneOf(["Patient", "Doctor"], "Invalid role")
    .required("Role is required"),
});



  

  let formik= useFormik({
    initialValues: {
      username: "",
      email: "",
      password:"",
      confirmedPassword:"",
      role:"Patient"
    },validationSchema, 
    onSubmit:handleRegister 

  })

  return (
  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 pt-24">
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-10">

      {/* Image */}
      <div className="flex justify-center mb-6 mt-6">
        <img src={registerImg} alt="Register" className="w-48" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">
        Create an account
      </h2>
      <p className="text-center text-gray-500 text-sm mb-6">
        Create your account to access smart MRI analysis, reports, and recommendations.
      </p>
      {submitStatus && (
  <div
    className={`mb-5 flex items-center gap-3 p-4 rounded-xl border text-sm transition-all
      ${
        submitStatus === "success"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : submitStatus === "exists"
          ? "bg-red-50 text-red-700 border-red-200"
          : submitStatus === "validation"
          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
  >
    {submitStatus === "success" && <FaCheckCircle className="text-blue-600 text-lg" />}
    {submitStatus === "exists" && <FaTimesCircle className="text-red-600 text-lg" />}
    {submitStatus === "validation" && <FaExclamationTriangle className="text-yellow-600 text-lg" />}
    {(submitStatus === "server" || submitStatus === "network") && (
      <FaTimesCircle className="text-red-600 text-lg" />
    )}

    <span>{submitMessage}</span>
  </div>
)}

 <form className="space-y-4" onSubmit={formik.handleSubmit}>

        {/* Username */}
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {formik.touched.username && formik.errors.username && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
        )}

        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
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

        {/* Password */}
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
            placeholder="Confirm password"
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

        {/* Role */}
        <div className="flex justify-center gap-8 pt-2 text-sm text-gray-600">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="Patient"
              checked={formik.values.role === "Patient"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            Patient
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="Doctor"
              checked={formik.values.role === "Doctor"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            Doctor
          </label>
        </div>
        {formik.touched.role && formik.errors.role && (
          <div className="text-red-500 text-sm text-center mt-1">{formik.errors.role}</div>
        )}

        {/* Button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Sign up
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
 <Link to="/login" className="text-blue-600 cursor-pointer hover:underline">Login</Link>
      </p>
    </div>
  </div>
);
}