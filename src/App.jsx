import { lazy, Suspense } from "react";
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'

// Lazy Pages
const Home = lazy(() => import('./Components/Home/Home'));
const About = lazy(() => import('./Components/About/About'));
const Work = lazy(() => import('./Components/Work/Work'));
const Login = lazy(() => import('./Components/Login/Login'));
const Signup = lazy(() => import('./Components/Signup/Signup'));
const Contact = lazy(() => import('./Components/Contact/Contact'));
const ForgetPassword = lazy(() => import('./Components/ForgetPassword/ForgetPassword'));
const ResetPassword = lazy(() => import('./Components/ResetPassword/ResetPassword'));
const Notfound = lazy(() => import('./Components/Notfound/Notfound'));

const PatientDashboard = lazy(() => import('./Components/Patient/Dashboard/PatientDashboard'));
const PatientScan = lazy(() => import('./Components/Patient/Scan/PatientScan'));
const PatientReports = lazy(() => import('./Components/Patient/Reports/PatientReports'));
const PatientRecommendation = lazy(() => import('./Components/Patient/Recommendation/PatientRecommendation'));
const PatientProfile = lazy(() => import('./Components/Patient/Profile/PatientProfile'));
const ChooseDoctor = lazy(() => import('./Components/Patient/Choose/ChooseDoctor'));

const DoctorDashboard = lazy(() => import('./Components/Doctor/Dashboard/DoctorDashboard'));
const DoctorReports = lazy(() => import('./Components/Doctor/Reports/DoctorReports'));
const DoctorRecommendation = lazy(() => import('./Components/Doctor/Recommendation/DoctorRecommendation'));
const DoctorProfile = lazy(() => import('./Components/Doctor/Profile/DoctorProfile'));
const Patient = lazy(() => import('./Components/Doctor/Patient/Patient'));
const PatientDetails = lazy(() => import('./Components/Doctor/Patient/PatientDetails'));

const Reports = lazy(() => import('./Components/Admin/Reports/Reports'));
const AdminDashboard = lazy(() => import('./Components/Admin/Dashboard/AdminDashboard'));
const AdminProfile = lazy(() => import('./Components/Admin/Profile/AdminProfile'));
const Doctors = lazy(() => import('./Components/Admin/Doctors/Doctors'));
const Patients = lazy(() => import('./Components/Admin/Patients/Patients'));

import UserContextProvider from './Context/UserContext';

// Router
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "about", element: <About /> },
      { path: "work", element: <Work /> },
      { path: "contact", element: <Contact /> },
      { path: "signup", element: <Signup /> },
      { path: "ForgetPassword", element: <ForgetPassword /> },
      { path: "reset-password/:token", element: <ResetPassword /> },
    ],
  },
  { path: "dashboard-patient", element: <PatientDashboard /> },
  { path: "scan-patient", element: <PatientScan /> },
  { path: "reports-patient", element: <PatientReports /> },
  { path: "recommendation-patient", element: <PatientRecommendation /> },
  { path: "profile-patient", element: <PatientProfile /> },
  { path: "choose-doctor", element: <ChooseDoctor /> },
  { path: "dashboard-doctor", element: <DoctorDashboard /> },
  { path: "reports-doctor", element: <DoctorReports /> },
  { path: "recommendation-doctor", element: <DoctorRecommendation /> },
  { path: "profile-doctor", element: <DoctorProfile /> },
  { path: "patientcheck", element: <Patient /> },
  { path: 'patient/:id', element: <PatientDetails /> },
  { path: "reports-admin", element: <Reports /> },
  { path: "dashboard-admin", element: <AdminDashboard /> },
  { path: "profile-admin", element: <AdminProfile /> },
  { path: "modify-doctors", element: <Doctors /> },
  { path: "modify-patients", element: <Patients /> },
  { path: "*", element: <Notfound /> }
]);

function App() {
  return (
    <UserContextProvider>
    <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl px-6 space-y-6">

        {/* title skeleton */}
        <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>

        {/* search skeleton */}
        <div className="flex gap-4">
          <div className="h-10 w-1/2 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-1/2 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* table skeleton */}
        <div className="space-y-3">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-12 bg-white shadow rounded-lg animate-pulse"></div>
          ))}
        </div>

      </div>
    </div>
  }>

        <RouterProvider router={router} />
      </Suspense>
    </UserContextProvider>
  );
}

export default App;