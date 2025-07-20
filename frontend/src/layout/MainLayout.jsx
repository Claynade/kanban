import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="h-screen w-[200px] bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] shadow-md">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        <Navbar />
        <main className="flex-1 px-6 pt-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
