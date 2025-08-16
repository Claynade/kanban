import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
  AiOutlineSetting,
  AiOutlineQuestionCircle,
  AiFillSun,
  AiFillMoon,
} from "react-icons/ai";

export default function NavHeader(props) {
  const { setUser } = useAuth();
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
        setUser(null); // Clear auth state
        navigate("/login");
      }
    } catch (error) {
      setUser(null); // Ensure auth state is cleared on error
      navigate("/login");
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="px-6 py-2 flex h-[60px] shadow-sm justify-between items-center border-b-3 border-[var(--border)] bg-[var(--background)]">
      <div className="flex flex-row mx-8 items-center rounded-3xl border-2 px-3 border-[var(--input)] focus-within:border-[var(--primary)]">
        <input
          type="text"
          placeholder="Search"
          className="w-[200px] px-2 py-1 bg-transparent text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none"
        />
      </div>

      <div className="flex items-center space-x-2 font-sans font-bold uppercase">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="px-2 py-1 rounded-full hover:bg-[var(--muted)] hover:text-[var(--chart-1)] cursor-pointer flex items-center justify-center text-xl transition-all duration-200"
            title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          >
            {isDarkMode ? <AiFillSun /> : <AiFillMoon />}
          </button>
        </div>
        <Link
          to="#"
          className="px-1 py-1 rounded-full hover:bg-[var(--muted)] hover:text-[var(--chart-1)] cursor-pointer"
        >
          <AiOutlineQuestionCircle
            className="text-[var(--muted-foreground)] text-3xl"
            title="Support"
          />
        </Link>
        <Link
          to="#"
          className="px-1 py-1 rounded-full hover:bg-[var(--muted)] hover:text-[var(--chart-1)] cursor-pointer"
        >
          <AiOutlineSetting
            className="text-[var(--muted-foreground)] text-3xl"
            title="Settings"
          />
        </Link>
        <div
          ref={menuRef}
          className={`relative px-3 py-1 rounded-full ${randomColor()} hover:opacity-90 cursor-pointer select-none`}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <h1 className="text-[var(--primary-foreground)] text-xl font-semibold">
            R
          </h1>
          {showMenu && (
            <div className="absolute right-0 top-12 min-w-[160px] bg-white dark:bg-[var(--background)] shadow-lg rounded-lg py-2 z-50 border border-[var(--border)]">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-[var(--muted)]"
                onClick={handleProfile}
              >
                View Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-[var(--muted)]"
                onClick={handleSettings}
              >
                Settings
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
