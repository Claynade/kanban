import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f1f5f9] to-white text-gray-800">
      <div className="h-screen w-[230px] bg-orange-300 text-white shadow-md">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <header className="bg-[#f8fafc] shadow-sm border-b border-gray-200">
          <Navbar />
        </header>
        <main className="flex-1 py-6 px-6 bg-transparent">
          <Outlet />
        </main>
{/*         <footer className="bg-white shadow-inner py-2 px-4 border-t border-gray-100">
          <Footer />
        </footer> */}
      </div>
    </div>
  );
};

export default MainLayout;
