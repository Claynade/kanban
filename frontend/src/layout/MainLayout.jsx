import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleWrapperClick = (e) => {
    if (!isSidebarOpen) return;
    if (e.target.classList.contains("sidebar")) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]"
      onClick={handleWrapperClick}
      style={{ position: "relative" }}
    >
      <div
        className={`h-screen w-full sm:w-[200px] ${
          isSidebarOpen ? "block" : "hidden"
        } sm:block`}
      >
        <div className="sidebar w-full">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 px-6 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
