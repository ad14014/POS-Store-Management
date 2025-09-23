import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ServerError from "./ServerError";

const AllProduct = () => {
  const navigate = useNavigate();
  const [Getproduct, setGetproduct] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);


  
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false); 
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const GetAllProduct = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3000/getAll", {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });

        setTimeout(() => {
          setGetproduct(response.data.Data);
          setLoading(false);
          setShowSuccessModal(true);
        }, 500);
      } catch (error) {
        console.error("Error fetching product:", error.message);
        setLoading(false);
         if (!error.response) {
        setServerError(true);
      } else {
        setMessage(error.response?.data?.message || "Something went wrong");
      }
      }
    };
    GetAllProduct();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:3000/delete/${deleteId}`);
      setGetproduct((prevData) =>
        prevData.filter((product) => product._id !== deleteId)
      );
      setShowDeleteSuccessModal(true);
    } catch (error) {
      console.log("Error deleting product:", error);
      if (!error.response) {
        setServerError(true);
      } else {
        setMessage(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  const filteredProducts = Getproduct.filter(
    (product) =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
     
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <img src="check.png" alt="success" className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Products Loaded Successfully!
            </h2>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

     
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {showDeleteSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <img src="check.png" alt="deleted" className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Product Deleted Successfully!
            </h2>
            <button
              onClick={() => setShowDeleteSuccessModal(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="sticky top-16 left-8 mt-4 w-110 max-w-5xl bg-white shadow-xl rounded-2xl p-4 flex items-center gap-4 border border-gray-100 z-50 mx-auto">
        <div className="flex items-center gap-2">
          <img src="filter.png" alt="Filter" className="h-6 w-6" />
          <span className="text-gray-700 font-semibold">Filters</span>
        </div>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-72 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />

        <button
          onClick={() => setSearchTerm("")}
          className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg shadow transition"
        >
          Clear
        </button>
      </div>

      
      <div className="flex flex-col items-center text-center mt-16">
        <h1 className="text-3xl font-extrabold text-gray-800 bg-white p-3 rounded-xl shadow-xl flex items-center gap-3">
          <img src="stars.png" className="h-10 w-10" alt="stars" />
          Choose Your Desired Product Here!
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100"
          >
            <img
              src="products.png"
              alt={product?.productName}
              className="w-32 h-32 object-contain mb-4 drop-shadow-md"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {product?.productName}
            </h2>
            <p className="text-sm text-gray-500 mb-1">{product?.categoryName}</p>
            <p className="text-sm text-gray-500 mb-1">{product?.sku}</p>
            <p className="text-sm text-gray-400 mb-1">
              Created: {new Date(product?.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400">
              Updated: {new Date(product?.updatedAt).toLocaleDateString()}
            </p>

            {product?.variants && product?.variants.length > 0 && (
              <div className="mt-6 w-30 rounded-2xl border border-gray-300 bg-gradient-to-r bg-gray-500 p-5 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-sm font-semibold text-black mb-2">
                  Variants:
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {product?.variants.map((variant) => (
                    <span
                      key={variant?._id}
                      className="px-3 py-1 text-white rounded-xl text-xs font-medium"
                    >
                      {variant?.variant_name} ({variant?.variant_value}) -{" "}
                      <span className="font-semibold">${variant?.price}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <button
                className="bg-white border-blue-700 border-1 hover:bg-blue-700 hover:text-white text-black font-semibold py-2 px-6 rounded-lg shadow transition"
                onClick={() => handleUpdate(product?._id)}
              >
                Update
              </button>
              <button
                className="bg-white border-red-700 border-1 hover:bg-red-700 hover:text-white text-black font-semibold py-2 px-6 rounded-lg shadow transition"
                onClick={() => {
                  setDeleteId(product?._id);
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProduct;
