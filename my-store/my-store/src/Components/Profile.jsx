import React from 'react'
import { useNavigate } from 'react-router-dom'


const Profile = () => {
    const navigate=useNavigate()
    const Profile=JSON.parse(localStorage.getItem("Profile"))
    const HandleLogout = () => {
    localStorage.clear();
    navigate('/')
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-xl rounded-2xl w-96 p-6 text-center border border-gray-200">
    
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
          <img src='profile.png'/>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800">{Profile.Name}</h2>
      <p className="text-gray-500">@{Profile.username}</p>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Email:</strong> {Profile.email}</p>
        <p><strong>User ID:</strong> {Profile._id}</p>
      </div>

 
      <div className="mt-6 flex justify-around">
        <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600">
          Edit Profile
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600" onClick={HandleLogout}>
          Logout
        </button>
      </div>
    </div>
  </div>
  )
}

export default Profile