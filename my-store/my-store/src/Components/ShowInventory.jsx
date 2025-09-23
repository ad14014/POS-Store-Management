import axios from "axios";
import React, { useEffect, useState } from "react";
import ServerError from "./ServerError";

function ShowInventory() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
   const [serverError, setServerError] = useState(false);


  const getAllInventory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/Inventory/getAllinventory"
      );
      setInventoryData(response.data.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      
if (!error.response) {
        setServerError(true);
      } else {
        setMessage(error.response?.data?.message || "Something went wrong");
      }

    } finally {
      // small delay for smooth UX
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    getAllInventory();
  }, []);

  if (loading) {
   
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }
 if (serverError) {
    return <ServerError />;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory List</h1>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inventoryData.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-blue-300 transition duration-300"
            >
              <div>
                <img
                  src="https://via.placeholder.com/400x200.png?text=Inventory+Image"
                  alt="Inventory"
                  className="rounded-t-2xl h-48 w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Product: {item.productName}
                </h2>
                <p className="text-gray-700 mb-2">Category: {item.category}</p>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <p className="text-blue-600 border px-3 py-1 rounded-lg">
                    Variant: {item.VariantName}
                  </p>
                  <p className="text-gray-800">Value: {item.varientValue}</p>
                  <p className="text-gray-800 col-span-2">
                    Location: {item.location}
                  </p>
                  <p className="text-gray-800">Quantity: {item.quantity}</p>
                </div>

                <div className="text-xs text-gray-600">
                  <p>
                    Last Updated:{" "}
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => deleteVarient(item._id)} // ✅ fixed item instead of variant
                    type="button"
                    className="text-red-600 hover:text-white border border-red-600 hover:bg-red-600 focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-sm px-5 w-full py-2.5 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      
    </div>
  );
}

export default ShowInventory;
