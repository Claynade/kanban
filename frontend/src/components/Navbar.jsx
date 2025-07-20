import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineSetting,
  AiOutlineQuestionCircle,
  AiFillSun,
  AiFillMoon,
} from "react-icons/ai";

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

export default function NavHeader(props) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches; // checks the window's theme
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
      document.documentElement.classList.add("dark"); // adds dark mode class to the root
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
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
        <Link
          to="#"
          className={`px-3 py-1 rounded-full ${randomColor()} hover:opacity-90 cursor-pointer`}
        >
          <h1 className="text-[var(--primary-foreground)] text-xl font-semibold">
            R
          </h1>
        </Link>
      </div>
    </div>
  );
}
