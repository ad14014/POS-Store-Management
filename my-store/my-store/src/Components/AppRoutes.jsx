import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProductFrom from "./ProductFrom";
import AllProduct from "./AllProduct";
import UpdateProduct from "./UpdateProduct";
import Navbar from "./Navbar";
import Cart from "./AddToCart";
import AllOrders from "./AllOrders";
import DiscountForm from "./DiscountForm";
import Login from "./LoginPage";
import Register from "./RegistrationForm";
import Profile from "./Profile";
import AllReturnOrders from "./AllReturnOrders";
import ShowVarients from "./ShowVarients";
import ShowInventory from "./ShowInventory";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminReturnOrders from "./AdminsReturnPage";




const OfflinePage = () => (

  
  <div> <img className="absolute left-85" src="Untitled design (1).png" alt="No Connection" /> <h1 className="absolute top-95 left-115 text-6xl font-bold text-blue-700"> Network Error! </h1> <p className="absolute top-110 left-140 text-purple-500 font-medium"> Internet connection not found </p> <p className="absolute top-115 left-115 text-purple-500 font-medium"> Please check your internet connection before trying again </p> <button className="absolute top-140 left-140 border-2 rounded-2xl bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700 text-white w-50 p-2"> Try again </button> </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/registration" ;

  
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  
  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
       <Route path="/registration" element={<Register />} />
        <Route element={<ProtectedRoutes />}>
<Route path="/return" element={<AllReturnOrders />} />
        <Route path="/home" element={<AllProduct />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addproduct" element={<ProductFrom />} />
        <Route path="/update/:id" element={<UpdateProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/allOrders" element={<AllOrders />} />
        <Route path="/discount" element={<DiscountForm />} />
        <Route path="/varient" element={<ShowVarients />} />
        <Route path="/inventory" element={<ShowInventory />} />
        <Route path="/admin-return"element={<AdminReturnOrders/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
