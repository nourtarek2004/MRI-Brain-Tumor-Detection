import React from 'react'

import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Link as ScrollLink } from "react-scroll";
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
         <a href="#home" className="flex items-center">
            <img src={logo}   className="h-8 md:h-10 w-auto"></img>
          </a>

          {/* Desktop Links */}
          <ul className="hidden  md:flex items-center gap-8 text-gray-600 font-medium">
          <li> <Link to="" className=" text-[#407bff]">Home</Link></li>
           <li> <Link to="work" className="hover:text-[#407bff]">How it works</Link></li>
            <li><Link to="about" className="hover:text-[#407bff]">About</Link></li>
            <li><Link to="contact" className="hover:text-[#407bff]">Contact</Link></li>
          </ul>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="login" className="px-4 py-2 rounded-lg text-[#407BFF] border border-[#407BFF] hover:bg-[#EAF0FF]" >Login </Link>
            <Link to="signup" className="px-4 py-2 rounded-lg bg-[#407BFF] text-white hover:bg-[#3069E0]">Sign Up</Link>
         </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <ul className="flex flex-col gap-4 p-4 text-gray-600">
            <li><a href="#home" onClick={()=>setOpen(false)}>Home</a></li>
            <li><a href="#how-it-works" onClick={()=>setOpen(false)}>How it works</a></li>
            <li><a href="#about" onClick={()=>setOpen(false)}>About</a></li>
            <li><a href="#contact" onClick={()=>setOpen(false)}>Contact</a></li>

            <hr />

            <Link to="/login" className="text-[#407BFF]">Login</Link>
            <Link
              to="/signup"
              className="bg-[#407BFF] text-white text-center py-2 rounded-lg"
            >
              Sign Up
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
}
