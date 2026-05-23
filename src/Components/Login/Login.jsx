import loginImg from "../../assets/login.png"; 
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import Dashboard from "../Patient/Dashboard/PatientDashboard";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  let{setUserData,setUserRole}=useContext(UserContext);
  const navigate = useNavigate();
 
  async function handleLogin(values) {
    try {
      const response = await axios.post(
        "https://mri-production-7e28.up.railway.app/users/login",
        values,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setSubmitStatus("success");
        setSubmitMessage("Login successful! Welcome back 🎉");
        console.log("TOKEN:", localStorage.getItem("token"));
        localStorage.setItem("token", response.data.data);
        localStorage.setItem("role", response.data.role);
          setUserData(response.data.data);
          setUserRole(response.data.role);



      //  روحى على الداشبورد
      setTimeout(() => {
        if (response.data.role === "Patient") {
      navigate("/dashboard-patient");
    } else if (response.data.role === "Doctor") {
      navigate("/dashboard-doctor");
    } else if (response.data.role === "Admin") {
      navigate("/dashboard-admin");
    }
      }, 1000);
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setSubmitStatus("invalid");
          setSubmitMessage("Invalid email/username or password.");
        } 
        else if (error.response.status === 401) {
          setSubmitStatus("notfound");
          setSubmitMessage("User not found. Please sign up first.");
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
    emailOrUsername: Yup.string().required("Email or Username is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      emailOrUsername: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 pt-24">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-10">

        {/* Image */}
        <div className="flex justify-center mb-6 mt-6">
          <img src={loginImg} alt="Login" className="w-48" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Log in to access your dashboard and continue your work.
        </p>

        {/* 🔵 رسالة النجاح أو الخطأ */}
        {submitStatus && (
          <div
            className={`mb-5 flex items-center gap-3 p-4 rounded-xl border text-sm transition-all
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

          {/* Email or Username */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Email or Username"
              name="emailOrUsername"
              value={formik.values.emailOrUsername}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {formik.touched.emailOrUsername && formik.errors.emailOrUsername && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.emailOrUsername}</div>
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/ForgetPassword" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}