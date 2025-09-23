import axios from "axios";
import React, { useEffect, useState } from "react";
import ServerError from "./ServerError";


function ShowVarients() {
  const [allVarient, setAllVarient] = useState([]);
  const [isOpen, setIsopen] = useState(null);
   const [serverError, setServerError] = useState(false);


  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state

  const getAllVarient = async () => {
    try {
      const response = await axios.get("http://localhost:3000/vareint/getAll");
      setAllVarient(response.data.data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error fetching variants:", error);
      
if (!error.response) {
        setServerError(true);
      } else {
        setMessage(error.response?.data?.message || "Something went wrong");
      }

    } finally {
      setTimeout(() => setLoading(false), 500); // smooth UX delay
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:3000/vareint/${deleteId}`);
      setAllVarient((prev) => prev.filter((v) => v._id !== deleteId));
      setShowDeleteSuccessModal(true);
    } catch (error) {
      console.error("Error deleting variant:", error);
      
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

  const toggle = (productId) => {
    setIsopen((prev) => (prev === productId ? null : productId));
  };

  const navigateToeditVarient = (id) =>
    console.log("Navigate to edit variant:", id);
  const navigateToeditProduct = (id) =>
    console.log("Navigate to edit product:", id);
  const navigateToeditInventory = (id) =>
    console.log("Navigate to edit inventory:", id);
  const navigateToeditAll = (id) => console.log("Navigate to edit all:", id);

  useEffect(() => {
    getAllVarient();
  }, []);

  // ✅ loader before content renders
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
    <div className="p-6 mt-20">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <img
              src="check.png"
              alt="success"
              className="w-12 h-12 mx-auto mb-3"
            />
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Variants Loaded Successfully!
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete this variant?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <img
              src="check.png"
              alt="deleted"
              className="w-12 h-12 mx-auto mb-3"
            />
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Variant Deleted Successfully!
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

      {/* Variants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allVarient.map((variant) => (
          <div
            key={variant._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-blue-300 transition duration-300"
          >
            <a href="#">
              <img
                className="rounded-t-2xl h-48 w-full object-cover"
                src="shutterstock_421087342.jpg"
                alt="Product"
              />
            </a>
            <div className="p-6">
              <h5 className="mb-2 text-xl font-bold text-gray-900">
                Product: {variant.productName}
              </h5>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">
                Price: ₹{variant.price}
              </h2>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <p className="border px-3 py-1 rounded-lg text-blue-600">
                  Variant: {variant.varientName}
                </p>
                <p className="font-light text-gray-700">
                  Value: {variant.variantValue}
                </p>
                <p className="font-light text-gray-700 col-span-2">
                  Category: {variant.category}
                </p>
                <p className="font-light text-gray-700">
                  Refundable: {variant.refundable.toString().toUpperCase()}
                </p>
              </div>

              <div className="mt-3 text-xs text-gray-600">
                <p>
                  Created: {new Date(variant.created_at).toLocaleDateString()}
                </p>
                {variant.updated_at && (
                  <p>
                    Updated: {new Date(variant.updated_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    setDeleteId(variant._id);
                    setShowDeleteModal(true);
                  }}
                  type="button"
                  className="text-red-600 hover:text-white border border-red-600 hover:bg-red-600 focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-sm px-5 w-full py-2.5 transition"
                >
                  Delete
                </button>
              </div>

              {isOpen === variant.product_Id && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                  <div className="bg-white rounded-2xl shadow-xl w-80 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      Edit Options
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <button
                          onClick={() => navigateToeditVarient(variant._id)}
                          className="w-full px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          Edit Variant
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateToeditProduct(variant.product_Id)
                          }
                          className="w-full px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          Edit Product
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigateToeditInventory(variant._id)}
                          className="w-full px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          Edit Inventory
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigateToeditAll(variant._id)}
                          className="w-full px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          Edit All
                        </button>
                      </li>
                    </ul>
                    <div className="mt-5 flex justify-center">
                      <button
                        onClick={() => setIsopen(null)}
                        className="px-5 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowVarients;
