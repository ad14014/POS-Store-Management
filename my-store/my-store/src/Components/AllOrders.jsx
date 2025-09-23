import axios from "axios";
import React, { useEffect, useState } from "react";
import ServerError from "./ServerError";

function AllOrders() {
  const email = JSON.parse(localStorage.getItem("user"));
  if (!email) return alert("You are not authorized for this page!!");

  const [order, setOrder] = useState([]);
  const [OrderDate, setOrderDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);

  const getAllOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/order/orders/${email}`);
      
       setTimeout(() => {
        setOrder(res.data.orders )
        setLoading(false);
      }, 500)
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (!error.response) {
        setServerError(true);
      } else {
        setMessage(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  useEffect(() => {
    getAllOrder();
  }, []);

  const filteredProducts = order.filter((product) => {
    const matchStatus = product.status
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchDate =
      OrderDate === "" ||
      new Date(product.date).toISOString().split("T")[0] === OrderDate;

    return matchStatus && matchDate;
  });
if (serverError) {
    return <ServerError />;
  }
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
    
      <div className="sticky top-16 left-10 mt-2 w-150 max-w-5xl bg-white border border-gray-200 shadow-lg rounded-xl p-4 flex items-center gap-4 z-50 mx-auto">
        <div className="flex items-center gap-2">
          <img src="filter.png" alt="Filter" className="h-6 w-6" />
          <span className="text-black font-medium">Filters</span>
        </div>

        <select
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Failure">Failure</option>
        </select>

        <input
          type="date"
          value={OrderDate}
          onChange={(e) => setOrderDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <button
          onClick={() => {
            setSearchTerm("");
            setOrderDate("");
          }}
          className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg transition"
        >
          Clear
        </button>
      </div>

  
      {loading && (
        <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
      </div>
      )}

    
      {!loading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <img src="empty.png" alt="No orders" className="h-32 mb-4" />
          <p className="text-lg font-medium">No orders found</p>
        </div>
      )}

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-32 px-4">
        {filteredProducts.map((ord, index) => (
          <div
            key={index}
            className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl p-5 flex flex-col items-center text-center border border-gray-100"
          >
           
            <div className="relative h-32 w-full flex justify-center">
              <img
                src="products.png"
                alt="Order Product"
                className="h-full object-contain rounded-lg drop-shadow-md"
              />
            </div>

           
            <div className="mt-4 w-full">
              {ord.cartItems?.map((v, idx) => (
                <h2
                  key={idx}
                  className="font-semibold text-gray-800 text-sm mb-1"
                >
                  {v.productName}
                </h2>
              ))}

              <h2 className="text-lg font-bold text-gray-900">
                {ord.customerName}
              </h2>
              <p className="text-sm text-gray-600">{ord.phoneNumber}</p>
            </div>

            <div className="mt-4 space-y-1 w-full text-left text-sm">
              <p>
                <span className="font-semibold">Address:</span> {ord.address}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> ₹{ord.amount}
              </p>
              <p>
                <span className="font-semibold">Total Price:</span> ₹
                {ord.totalPrice}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(ord.date).toDateString()}
              </p>
              <p>
                <span className="font-semibold">Payment Mode:</span>{" "}
                {ord.paymentMode}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    ord.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : ord.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {ord.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Posted By:</span> {ord.postedBy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllOrders;
