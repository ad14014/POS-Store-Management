import React from 'react'

function ServerError() {
  return (
    <div>
      <img className='h-100 w-120 absolute left-100' src='server error.jpg'/>
      <h1 className='absolute top-100 left-105 font-bold text-6xl text-red-600'>SERVER ERROR!</h1>
      <h1 className='absolute top-115 left-147 font-bold text-6xl text-red-600'>500</h1>
      <p className='absolute top-130 left-127 font-semibold text-3xl text-gray-600'>Internal Server Error</p>
    </div>
  )
}

export default ServerError


