import React from 'react'
import { Link } from 'react-router-dom'
export default function NavHeader(props) {

    const linkObj = [
        {
            title: 'Home',
            path: '/'
        },
        {
            title: 'About Us',
            path: '/About'
        },
        {
            title: 'Contact',
            path: '/Contact'
        }
    ]

    return (
        <div className='px-6 py-4 flex justify-between items-center border-b-3 border-gray-300 '>
          <div className='flex flex-row mx-8 items-center rounded-3xl border-2 px-3 border-gray-300 focus:outline-none focus:border-red-400 justify-between'>
            <div>
                <input type="text" placeholder='Search' className='w-[200px] px-2 py-1 focus:outline-none ' />
            </div>
            <img src='/search.png' className='h-6'/>
          </div>
            <div className='flex items-center space-x-16'>
                <div className='space-x-8 font-Poppins font-bold'>
                    {linkObj.map((link) => <a href={link.path} className='hover:text-blue-400 hover:underline'>{link.title}</a>)}
                </div>
                <div className='flex space-x-2 font-sans font-bold uppercase'>
                    <Link to="Login" className='px-4 py-1 border-2 border-gray-500 rounded-full hover:bg-purple-900 hover:border-gray-50 hover:text-gray-100 cursor-pointer'>
                        <h1>Login</h1>
                    </Link>
                    <Link to="SignUp" className='px-4 py-1 border-2 border-gray-500 rounded-full hover:bg-purple-900 hover:border-gray-50 hover:text-gray-100 cursor-pointer'>
                        <h1>Sign Up</h1>
                    </Link>
                </div>
            </div>
        </div>
    )

}
