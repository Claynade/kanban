import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineSetting, AiOutlineQuestionCircle } from "react-icons/ai";


const randomColor = () => {
    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-orange-400', 'bg-purple-500'];
    return colors[Math.floor(Math.random() * colors.length)];
}

export default function NavHeader(props) {
    return (
        <div className='px-6 py-2 flex justify-between items-center border-b-3 border-gray-300 '>
          <div className='flex flex-row mx-8 items-center rounded-3xl border-2 px-3 border-gray-300 focus:outline-none focus:border-red-400 justify-between'>
            <div>
                <input type="text" placeholder='Search' className='w-[200px] px-2 py-1 focus:outline-none ' />
            </div>
          </div>
            <div className='flex items-center space-x-2 font-sans font-bold uppercase'>
                <Link to="#" className='px-1 py-1 rounded-full  hover:bg-gray-200 hover:text-blue-400 cursor-pointer'>
                    <AiOutlineQuestionCircle className='text-gray-600 text-3xl' />
                </Link>
                <Link to="#" className='px-1 py-1 rounded-full  hover:bg-gray-200 hover:text-blue-400 cursor-pointer'>
                    <AiOutlineSetting className='text-gray-600 text-3xl' />
                </Link>
                <Link to="#" className={`px-3 py-1 rounded-full ${randomColor()} hover:bg-purple-900 hover:border-gray-50 hover:text-gray-100 cursor-pointer`}>
                    <h1 className='text-white text-xl font-semibold'>R</h1>
                </Link>
            </div>
        </div>
    )

}
