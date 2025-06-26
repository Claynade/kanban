import React from 'react'


import { useState } from 'react';

const ProjectCard = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div className="flex flex-row cursor-pointer" onClick={handleClick}>
      <div
        className={`flex flex-col justify-center items-center rounded-lg mb-2 p-2 w-full text-center transition-all duration-200
          shadow-[0_4px_2px_rgba(0,0,0,0.1)]
          ${isActive ? 'bg-[#532b9e] border-r-[3px] border-solid border-gray-300' : 'hover:bg-violet-800'}
        `}
      >
        <h2 className="text-md text-blue-50 font-sans w-full text-center">{title}</h2>
        {children}
      </div>

      {/* Conditional Arrow */}
      {isActive && (
        <div className="flex items-center text-gray-200 pl-2">
          <img src="/arr_right.png" className="scale-150" alt="Arrow" />
        </div>
      )}
    </div>
  );
};




const Sidebar = () => {
  return (
    <div className='flex flex-col bg-gradient-to-br from-purple-900 to-indigo-900 h-screen items-center shadow text-black py-4'>
      <div className='h-[80px] flex flex-row gap-4 items-center justify-center font-[Shantell_sans] text-white text-2xl font-bold'>
        <img src='/icon.svg' className='h-10 mx-auto' alt="Logo" />
        kanban
      </div>
      <div className='w-full h-full flex flex-col items-center justify-between'>
        <div className='flex flex-col p-4 w-full'>
          <ProjectCard title="kanban Board"/>
          <ProjectCard title="To-Do"/>
          <ProjectCard title="Ouija Board"/>
        </div>
        <div className='flex h-12 pb-3 w-12 bg-gray-50 text-gray-600 text-5xl rounded-full justify-center items-center hover:bg-red-400 hover:text-gray-50 cursor-pointer mt-4'>
          +
        </div>
      </div>
    </div>
  )
}

export default Sidebar