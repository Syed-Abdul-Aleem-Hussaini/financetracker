import React from 'react'
import { FaSpinner } from 'react-icons/fa'
const Loading = () => {
  return (
    <div className='w-full flex item-center justify-center py-2'>
        <FaSpinner className='animate-spin text-gray-300' size = {28}  />
      
    </div>
  )
}

export default Loading
