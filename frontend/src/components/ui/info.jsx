import React from 'react'
import { FaSearch } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";




const Info = ({title, subTitle}) => {
  return (
    <div className='flex-col md:flex-row md:items-center justify-between py-8'>

   <div className='mb-6'>
    <h1 className='text-4xl font-semibold text-black dark:text-gray-300 mb-2'>{title}</h1>
   <span  className='text-gray-600  dark:text-gray-500'>{subTitle}</span>
   </div>
   <div className='flex items-center gap-4 md:gap-10 2xl:gap-20'>
    <div className='flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md p-2'>
      <FaSearch  className='text-xl text-gray-600 dark:text=gray-500' />
      <input type="text"  placeholder='Search now ... ' className='bg-transparent ouline-none text-gray-700' />

    </div>
    <button className='flex items-center gap-2 bg-black dark:bg-violet-800 py-4 px-4 rounded text-white'>
      <IoFilter  size={24} className='hover:animate-bounce'/>
      <span className='text-base'>Filter By</span>
    </button>
   </div>
    </div>
  )
}

export default Info
