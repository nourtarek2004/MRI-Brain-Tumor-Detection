import { useState, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { UserContext } from "../../Context/UserContext";

export default function NavRole() {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const location = useLocation();
  const { userData, userRole } = useContext(UserContext);
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("doctorImage"); // لو مستخدماه
  window.location.href = "/login";
};

  // تحديد الروابط حسب الـ role
  const routes = useMemo(() => {
    if (userRole === "Doctor") {
      return {
        dashboard: "/dashboard-doctor",
        reports: "/reports-doctor",
        recommendation: "/recommendation-doctor",
        profile: "/profile-doctor",
        extra: [{ name: "Patients", path: "/patientcheck" }],
      };
    }

    if (userRole === "Admin") {
      return {
        dashboard: "/dashboard-admin",
        reports: "/reports-admin",
        profile: "/profile-admin",
      
        extra: [
          { name: "Doctors", path: "/modify-doctors" },
          { name: "Patients", path: "/modify-patients" },
        ],
      };
    }

    // Patient
    return {
      dashboard: "/dashboard-patient",
      reports: "/reports-patient",
      recommendation: "/recommendation-patient",
      profile: "/profile-patient",
      extra: [
        { name: "Upload Scan", path: "/scan-patient" },
        { name: "Assign Doctor", path: "/choose-doctor" },
      ],
    };
  }, [userRole]);

  // active link
  const linkClass = (path) =>
    location.pathname === path
      ? "text-[#407BFF]"
      : "hover:text-[#407BFF]";

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={routes.dashboard} className="flex items-center">
            <img src={logo} className="h-8 md:h-10" alt="logo" />
          </Link>

          {/* Links */}
          <ul className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
            <li>
              <Link to={routes.dashboard} className={linkClass(routes.dashboard)}>
                Dashboard
              </Link>
            </li>

            <li>
              <Link to={routes.reports} className={linkClass(routes.reports)}>
                Reports
              </Link>
            </li>

            {/* ✅ تظهر بس لو موجودة */}
            {routes.recommendation && (
              <li>
                <Link
                  to={routes.recommendation}
                  className={linkClass(routes.recommendation)}
                >
                  Recommendation
                </Link>
              </li>
            )}

            <li>
              <Link to={routes.profile} className={linkClass(routes.profile)}>
                Profile
              </Link>
            </li>

            {routes.extra.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={linkClass(item.path)}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* User */}
          <div className="relative hidden md:block">
            <div
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FaUserCircle className="text-2xl text-gray-500" />
              <span className="text-sm font-medium">
                {userData?.username || "User"}
              </span>
            </div>

            {userMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-lg p-2 text-sm">
                <Link
                  to={routes.profile}
                  className="block p-2 hover:bg-gray-100 rounded"
                >
                  Profile
                </Link>
                <button
  onClick={handleLogout}
  className="w-full text-left p-2 hover:bg-red-100 text-red-500 rounded"> Logout</button>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden text-xl"
            onClick={() => setOpen(!open)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
     {open && (
  <div className="fixed inset-0 bg-black/30 z-40 md:hidden">
    <div className="bg-white w-3/4 h-full p-6 shadow-lg">

      <ul className="flex flex-col gap-5 text-gray-700 text-lg">

        <Link to={routes.dashboard} onClick={() => setOpen(false)}>Dashboard</Link>

        <Link to={routes.reports} onClick={() => setOpen(false)}>Reports</Link>

        {routes.recommendation && (
          <Link to={routes.recommendation} onClick={() => setOpen(false)}>
            Recommendation
          </Link>
        )}

        <Link to={routes.profile} onClick={() => setOpen(false)}>Profile</Link>

        {routes.extra.map((item) => (
          <Link key={item.path} to={item.path} onClick={() => setOpen(false)}>
            {item.name}
          </Link>
        ))}

        <hr />

        <button className="text-red-500 text-left">Logout</button>
      </ul>
    </div>
  </div>
)}
    </nav>
  );
}