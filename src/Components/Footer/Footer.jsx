
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
export default function Footer() {
  return (
    <footer className="bg-[#c4d6ff] mt-10 p-10 text-sm text-gray-800">
      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">

        {/* Logo + description */}
        <div>
          <img src={logo} alt="TUMORX Logo" className="w-28 mb-3" />
          <p className="text-gray-700">
            Analyze brain MRI scans with AI precision.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3 text-base">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-blue-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/work" className="hover:text-blue-600 transition">
                Work
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-600 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-3 text-base">Support</h3>
          <ul className="space-y-2">
            <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-600 cursor-pointer">FAQ</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3 text-base">Contact Us</h3>
          <p className="mb-2">+966 4377 5817</p>
          <p className="text-gray-700">support@tumorx.ai</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t mt-8 pt-4 text-center text-gray-600 text-xs">
        © {new Date().getFullYear()} TUMORX. All rights reserved.
      </div>
    </footer>
  );
}
