import React, { useState, useEffect } from "react";
import { AiFillSun, AiFillMoon } from "react-icons/ai";

const ThemeToggle = ({ className = "" }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

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

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-md hover:bg-[var(--muted)] hover:text-[var(--chart-1)] cursor-pointer flex items-center justify-center text-xl transition-all duration-200 ${className}`}
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      {isDarkMode ? <AiFillSun /> : <AiFillMoon />}
    </button>
  );
};

export default ThemeToggle;
