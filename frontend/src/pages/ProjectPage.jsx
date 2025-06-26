import React from 'react'
import { useParams } from 'react-router-dom'

function randomColor(){
  const colors = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100'];
  return colors[Math.floor(Math.random() * colors.length)];
}
function randomRotation(){
  const rotations = ['rotate-0', 'rotate-1', 'rotate-2', 'rotate-3', 'rotate-4', 'rotate-5'];
  return rotations[Math.floor(Math.random() * rotations.length)];
}

const Card = ({ id }) => {
  const randomColorClass = randomColor();
  const randomRotationClass = randomRotation();
  
  return (
        <div className='w-full'>
          <div className={`${randomColorClass} ${randomRotationClass} shadow mt-4  p-4 rounded w-full`}>
            <h2 className='text-lg font-bold mb-2 text-gray-600'>Project Details</h2>
            <p className='text-gray-700'>Project ID: {id}</p>
          </div>
        </div>
  )
}

const Icon = () => {
  return (<div className='h-10 text-3xl text-center w-10 rounded-lg bg-amber-50 shadow-md shadow-amber-200'>
    +
  </div>)
}
const ProjectPage = () => {
  const { id } = useParams();

  return (
    <div className='flex flex-row gap-4 justify-between'>
      <div className='flex flex-row gap-16 flex-grow justify-center'>
      <div className='h-[500px] w-[300px] bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg shadow-lg shadow-gray-300'>
      <div className='flex flex-col relative left-1 top-1 font-[Shantell_sans] bg-amber-50 w-[292px] h-[492px] items-center rounded-lg shadow text-black p-4'>
        <div className='flex justify-center h-[40px] w-full border-b-3 border-gray-300 text-gray-700 text-center text-xl font-bold'>
          To-Do
        </div>
        <Card id={id} />
        <Card id={id} />
        <Card id={id} />
      </div>
      </div>
      <div className='h-[500px] w-[300px] bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg shadow-lg shadow-gray-300'>
      <div className='flex flex-col relative left-1 top-1 font-[Shantell_sans] bg-amber-50 w-[292px] h-[492px] items-center rounded-lg shadow text-black p-4'>
        <div className='flex justify-center h-[40px] w-full border-b-3 border-gray-300 text-gray-700 text-center text-xl font-bold'>
          Backlog
        </div>
        <Card id={id} />
        <Card id={id} />
      </div>
      </div>
      <div className='h-[500px] w-[300px] bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg shadow-lg shadow-gray-300'>
      <div className='flex flex-col relative left-1 top-1 font-[Shantell_sans] bg-amber-50 w-[292px] h-[492px] items-center rounded-lg shadow text-black p-4'>
        <div className='flex justify-center h-[40px] w-full border-b-3 border-gray-300 text-gray-700 text-center text-xl font-bold'>
          Completed
        </div>
        <Card id={id} />
        <Card id={id} />
      </div>
      </div>
      </div>
      
      <div className='flex flex-col gap-8 justify-start items-center shadow py-4 h-[500px] w-[70px] bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg'>
        <Icon />
        <Icon />
        <Icon />
        </div>

{/*       <div className='flex flex-col font-[Shantell_sans] bg-gradient-to-tl from-red-300 to-orange-300 w-[300px] h-[500px] items-center rounded-lg shadow text-black p-4'>
        <div className='flex justify-center h-[40px] w-full border-b-3 border-red-100 text-center text-xl font-bold'>
          completed
        </div>
        <Card id={id} />
        <Card id={id} />
        <Card id={id} />
      </div>
       */}
    </div>
  );
};

export default ProjectPage;
