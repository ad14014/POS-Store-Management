// src/pages/ProductForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import ServerError from "./ServerError";

const ProductForm = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [message, setMessage] = useState(""); 

  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    categoryId: "",
    description: "",
    price: "",
    variants: [
      { variant_name: "", variant_value: "", price: "", refundable: "", quantity: "", location: "" }
    ],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!token) {
      alert("You are not authorized for this Page!!");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/category/getAll", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCategories(res.data.Data))
      .catch((err) => {
        console.error(err);
        if (!err.response) {
          setServerError(true);
        } else {
          setMessage(err.response?.data?.message || "Failed to load categories");
        }
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 500);
      });
  }, [token]);

  // Handle product fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle variant fields
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...formData.variants];
    updatedVariants[index][name] = value;
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { variant_name: "", variant_value: "", price: "", refundable: "", quantity: "", location: "" },
      ],
    }));
  };

  const removeVariant = (index) => {
    const updatedVariants = [...formData.variants];
    updatedVariants.splice(index, 1);
    setFormData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      productName: formData.productName,
      sku: formData.sku,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price,
      variants: formData.variants.map((v) => ({
        variant_name: v.variant_name,
        variant_value: v.variant_value,
        sku: formData.sku, // reuse product SKU or make unique
        price: v.price,
        refundable: v.refundable === "true",
        quantity: v.quantity,
        location: v.location,
      })),
    };

    try {
      await axios.post("http://localhost:3000/create", payload, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Product Added Successfully!!");

      setFormData({
        productName: "",
        sku: "",
        categoryId: "",
        description: "",
        price: "",
        variants: [
          { variant_name: "", variant_value: "", price: "", refundable: "", quantity: "", location: "" }
        ],
      });
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setServerError(true);
      } else {
        setMessage(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  if (serverError) return <ServerError />;
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 mt-16">
      <form
        className="w-full max-w-lg bg-stone-200 p-6 rounded-2xl shadow-xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-black text-center">
          Add New Product
        </h2>

        {message && <p className="mt-2 text-center text-sm text-red-500">{message}</p>}

        {/* Product Info */}
        <input
          type="text"
          name="productName"
          placeholder="Enter product name"
          value={formData.productName}
          onChange={handleChange}
          className="mt-3 w-full rounded-xl border px-4 py-2 bg-white"
          required
        />

        <input
          type="text"
          name="sku"
          placeholder="Enter SKU"
          value={formData.sku}
          onChange={handleChange}
          className="mt-3 w-full rounded-xl border px-4 py-2 bg-white"
          required
        />

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="mt-3 w-full rounded-xl border px-4 py-2 bg-white"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Enter description"
          value={formData.description}
          onChange={handleChange}
          className="mt-3 w-full rounded-xl border px-4 py-2 h-26 bg-white"
        />

        <input
          type="number"
          name="price"
          placeholder="Enter base price"
          value={formData.price}
          onChange={handleChange}
          className="mt-3 w-full rounded-xl border px-4 py-2 bg-white"
          required
        />

        <hr className="border-gray-400 my-3" />

        {/* Variants */}
        <h3 className="text-lg font-semibold text-gray-800">Variants</h3>
        {formData.variants.map((variant, index) => (
          <div key={index} className="border p-3 rounded-xl mt-3 bg-white shadow-sm">
            <input
              type="text"
              name="variant_name"
              placeholder="Variant name (e.g. Size, Color)"
              value={variant.variant_name}
              onChange={(e) => handleVariantChange(index, e)}
              className="mt-2 w-full rounded-xl border px-4 py-2"
              required
            />
            <input
              type="text"
              name="variant_value"
              placeholder="Variant value (e.g. Large, Red)"
              value={variant.variant_value}
              onChange={(e) => handleVariantChange(index, e)}
              className="mt-2 w-full rounded-xl border px-4 py-2"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, e)}
              className="mt-2 w-full rounded-xl border px-4 py-2"
              required
            />
            <select
              name="refundable"
              value={variant.refundable}
              onChange={(e) => handleVariantChange(index, e)}
              className="mt-2 w-full rounded-xl border px-4 py-2"
              required
            >
              <option value="">Refundable?</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={variant.quantity}
              onChange={(e) => handleVariantChange(index, e)}
              className="mt-2 w-full rounded-xl border px-4 py-2"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={variant.location}
              onChange={(e) => handleVariantChange(index, e)}
              className="mt-2 w-full rounded-xl border px-4 py-2"
            />

            {formData.variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
        >
          ➕ Add Another Variant
        </button>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
