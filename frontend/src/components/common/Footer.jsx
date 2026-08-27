import React from "react";
import { Link } from "react-router-dom";
import { FiActivity, FiMapPin, FiPhone, FiMail, FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
                <FiActivity className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Court<span className="text-emerald-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              The premium sports court booking platform. Discover courts, book time slots in real-time, and manage recurring weekly matches.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courts" className="hover:text-emerald-400 transition-colors">
                  Browse Courts
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-emerald-400 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Sports */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              Popular Sports
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                Badminton Courts
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                Football Turfs
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                Tennis Courts
              </li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">
                Basketball Arenas
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">
              Support & Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-2">
                <FiMapPin className="text-emerald-400 flex-shrink-0" />
                <span>Sports Complex Rd, Arena District</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="text-emerald-400 flex-shrink-0" />
                <span>+1 (800) 555-COURT</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="text-emerald-400 flex-shrink-0" />
                <span>support@courthub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CourtHub Inc. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <FiHeart className="text-rose-500 inline mx-1" />
            <span>for sports enthusiasts</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
