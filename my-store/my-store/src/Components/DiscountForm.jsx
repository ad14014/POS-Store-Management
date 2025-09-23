import axios from "axios";
import React, { useEffect, useState } from "react";
import ServerError from "./ServerError";

const DiscountForm = () => {
  const token = localStorage.getItem("token");
  if (!token) return alert("You are not Authorize for this Page!!");

  const [variants, setVariants] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    value: "",
    variant_id: "",
  });
  const [serverError, setServerError] = useState(false);
  const [loading, setLoading] = useState(true); // spinner state
  const [message, setMessage] = useState(""); // error/validation messages

  useEffect(() => {
    const getVariants = async () => {
      try {
        const res = await axios.get("http://localhost:3000/vareint/getAll", {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });
        setVariants(res.data.data);
        console.log(res.data.data);
        
      } catch (err) {
        console.error("Error fetching variants", err);
        if (!err.response) {
          setServerError(true);
        } else {
          setMessage(err.response?.data?.message || "Something went wrong");
        }
      }
    };

    const getDiscounts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/discount/getAll", {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });
        setDiscounts(res.data.Data);
      } catch (err) {
        console.error("Error fetching discounts", err);
        if (!err.response) {
          setServerError(true);
        } else {
          setMessage(err.response?.data?.message || "Something went wrong");
        }
      }
    };

    
    Promise.all([getVariants(), getDiscounts()]).finally(() =>
      setTimeout(() => setLoading(false), 500)
    );
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/discount/create", formData, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Discount created successfully!");
      setFormData({
        name: "",
        type: "",
        value: "",
        variant_id: "",
      });
      
      const res = await axios.get("http://localhost:3000/discount/getAll", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      setDiscounts(res.data.Data);
    } catch (err) {
      console.error("Error creating discount", err);
      alert("Failed to create discount");
      if (!err.response) {
        setServerError(true);
      } else {
        setMessage(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  if (serverError) {
    return <ServerError />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto mt-20 ">
      <h2 className="text-3xl font-bold mb-4 flex justify-center">
        Discount Form
      </h2>

      {message && (
        <p className="mb-2 text-center text-sm text-red-500">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-stone-200 shadow-lg rounded-lg p-4 mb-6 space-y-4"
      >
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white"
            required
          >
            <option value="">Select Type</option>
            <option value="On Product">On Product</option>
            <option value="On Category">On Category</option>
            <option value="Flat">Flat</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Value (%)</label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            min="0"
            className="w-full border rounded p-2 bg-white"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Variant</label>
          <select
            name="variant_id"
            value={formData.variant_id}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-white"
            required
          >
            <option value="">Select Variant</option>
            {variants.map((variant) => (
              <option key={variant._id} value={variant._id}>
                {variant.varientName} - {variant.variantValue} (₹
                {variant.price})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Discount
        </button>
      </form>

      <h2 className="text-xl font-bold mb-2">All Discounts</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Type</th>
              <th className="border px-3 py-2">Value</th>
              <th className="border px-3 py-2">Variant</th>
              <th className="border px-3 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length > 0 ? (
              discounts.map((d) => (
                <tr key={d._id}>
                  <td className="border px-3 py-2">{d.name}</td>
                  <td className="border px-3 py-2">{d.type}</td>
                  <td className="border px-3 py-2">{d.value}%</td>
                  <td className="border px-3 py-2">
                    {d.variant_id?.variant_name} - {d.variant_id?.variant_value}
                  </td>
                  <td className="border px-3 py-2">₹{d.variant_id?.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-3 text-gray-500"
                >
                  No discounts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountForm;
