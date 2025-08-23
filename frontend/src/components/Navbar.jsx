import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
  AiOutlineSetting,
  AiOutlineMenu,
  AiOutlineQuestionCircle,
  AiFillSun,
  AiFillMoon,
} from "react-icons/ai";

export default function NavHeader({ isSidebarOpen, setIsSidebarOpen }) {
  const { user, setUser } = useAuth();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const randomColor = () => {
    const colors = [
      "bg-[var(--chart-1)]",
      "bg-[var(--chart-2)]",
      "bg-[var(--chart-3)]",
      "bg-[var(--chart-4)]",
      "bg-[var(--chart-5)]",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (savedTheme === "light" || (!savedTheme && !prefersDark)) {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleProfile = () => {
    setShowMenu(false);
    navigate("/profile");
  };
  const handleSettings = () => {
    setShowMenu(false);
    navigate("/settings");
  };
  const handleLogout = async () => {
    setShowMenu(false);
    try {
      const response = await API.post("/auth/logout");
      if (response.status === 200) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      setUser(null);
      navigate("/login");
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="px-3 sm:px-6 py-2 flex h-[60px] shadow-sm justify-between items-center border-b-3 border-[var(--border)] bg-[var(--background)]">
      {/* Mobile sidebar toggle */}
      <div className="flex items-center">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[var(--muted)]"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          <AiOutlineMenu className="text-xl" />
        </button>

        <span className="font-bold text-lg ml-2 sm:hidden">Kanban</span>
      </div>

      <div className="hidden sm:flex flex-row items-center rounded-3xl border-2 px-3 border-[var(--input)] focus-within:border-[var(--primary)] max-w-xs flex-grow mx-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-2 py-1 bg-transparent text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 font-sans font-bold">
        {/* Theme toggle - always visible */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--muted)] hover:text-[var(--chart-1)] cursor-pointer flex items-center justify-center text-xl transition-all duration-200"
          title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
        >
          {isDarkMode ? <AiFillSun /> : <AiFillMoon />}
        </button>

        {/* Support button - hidden on small screens */}
        <Link
          to="#"
          className="hidden sm:flex p-2 rounded-full hover:bg-[var(--muted)] cursor-pointer group"
        >
          <AiOutlineQuestionCircle
            className="text-[var(--muted-foreground)] text-2xl group-hover:text-[var(--chart-1)] transition-colors duration-200"
            title="Support"
          />
        </Link>

        {/* Settings button - hidden on small screens */}
        <Link
          to="#"
          className="hidden sm:flex p-2 rounded-full hover:bg-[var(--muted)] cursor-pointer group"
        >
          <AiOutlineSetting
            className="text-[var(--muted-foreground)] text-2xl group-hover:text-[var(--chart-1)] transition-colors duration-200"
            title="Settings"
          />
        </Link>

        {/* User profile with dropdown menu */}
        <div
          ref={menuRef}
          className={`relative p-2 rounded-full ${randomColor()} hover:opacity-90 cursor-pointer select-none`}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <h1 className="text-[var(--primary-foreground)] px-2 text-lg font-semibold">
            {user?.name[0] || "U"}
          </h1>
          {showMenu && (
            <div className="absolute right-0 top-12 min-w-[200px] bg-white dark:bg-[var(--background)] shadow-lg rounded-lg py-2 z-50 border border-[var(--border)]">
              {/* User info section */}
              {user && (
                <div className="px-4 py-2 border-b border-[var(--border)]">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {user.email}
                  </div>
                </div>
              )}

              {/* Menu items */}
              <button
                className="block w-full text-left px-4 py-3 hover:bg-[var(--muted)] text-sm"
                onClick={handleProfile}
              >
                View Profile
              </button>
              <button
                className="block w-full text-left px-4 py-3 hover:bg-[var(--muted)] text-sm"
                onClick={handleSettings}
              >
                Settings
              </button>

              {/* Show these items on mobile only */}
              <div className="sm:hidden border-t border-[var(--border)] mt-1">
                <Link
                  to="#"
                  className="block w-full text-left px-4 py-3 hover:bg-[var(--muted)] text-sm"
                >
                  Help & Support
                </Link>
              </div>

              {/* Logout is shown to everyone */}
              <div className="border-t border-[var(--border)] mt-1">
                <button
                  className="block w-full text-left px-4 py-3 hover:bg-red-100 text-red-600 text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
