import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavbarWithSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    
  };

  return (
    <div className="relative">
      <header className="fixed inset-x-0 top-0 z-20 bg-white shadow h-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-2xl"
            >
              ☰
            </button>
            <Link to="/home">
              <img
                src="e-commerace_17241440.png"
                alt="Logo"
                className="h-12 w-auto cursor-pointer"
              />
            </Link>
          </div>

       
        <nav className="hidden sm:flex space-x-8 bg-white shadow-md px-6 py-3 rounded-xl relative right-10">
  <Link
    to="/home"
    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
  >
    Home
  </Link>
  <Link
    to="/addproduct"
    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
  >
    Add Product
  </Link>
  <Link
    to="/return"
    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
  >
    Return Section
  </Link>
</nav>


         
          <div className="flex items-center gap-5">
          <Link to="/profile">
              <img
                src="user_6994705.png"
                alt="User"
                className="h-9 w-9 rounded-full cursor-pointer"
              />
            </Link>
          
          </div>
        </div>
      </header>

      {/* Sidebar & Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-600 "
          >
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h2 className="text-2xl font-semibold">MENU</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                Close
              </button>
            </div>
            <nav className="mt-6 flex flex-col space-y-3 px-4">
             
              <Link to="/varient" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-200 focus:bg-blue-200">
               All Variant
              </Link>
              <Link to="/inventory" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-200 focus:bg-blue-200">
               All Inventory
              </Link>
              <Link to="/cart" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-200 focus:bg-blue-200">
               Add to Cart
              </Link>
              <Link to="/discount" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-200 focus:bg-blue-200">
               Discounts Details
              </Link>
              <Link to="/allOrders" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-200 focus:bg-blue-200">
                Placed Orders
              </Link>
              <Link to="/admin-return" className="px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-200 focus:bg-blue-200">
                All Return Orders
              </Link>
             
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:bg-red-700"
              >
                Logout
              </button>
            </nav>
          </div>
          <button
            aria-label="Close sidebar"
            className="fixed inset-0 z-20 "
            onClick={() => setSidebarOpen(false)}
          />
        
        </>
      )}

      
    </div>
  );
};

export default NavbarWithSidebar;
