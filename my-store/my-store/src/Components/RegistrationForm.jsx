
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ServerError from "./ServerError";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    Name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
const [serverError, setServerError] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/user/register", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user.email));

      setMessage(res.data.message);
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Registration failed");
      if (!err.response) {
        setServerError(true);
      } else {
        setMessage(err.response?.data?.message || "Something went wrong");
      }
    }
  };
  const HandleLogin=()=>{
    navigate("/")
  }
if (serverError) {
    return <ServerError />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex overflow-hidden">
      
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome In Registration</h1>
          <p className="text-gray-500 mb-8">
            Please Register Here
          </p>

          <h2 className="text-3xl font-semibold text-gray-700 mb-6 flex justify-center">Registration Form</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="text"
              name="Name"
              placeholder="Full Name"
              value={formData.Name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-medium"
            >
              Register
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-red-500">{message}</p>
          )}

          <div className="mt-6 text-center text-sm">
            <p>
              Already have an account?{" "}
              <a  className="text-indigo-600 hover:underline" onClick={HandleLogin}>
                Login
              </a>
            </p>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 bg-indigo-50 items-center justify-center cursor-pointer">
          <img
            src="illustration.png"
           
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
