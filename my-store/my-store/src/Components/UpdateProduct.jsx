import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ServerError from "./ServerError";

const UpdateProduct = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
    const [serverError, setServerError] = useState(false);
  const [allVariants, setAllVariants] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    description: '',
    categoryId: '',
    price: 0,
    image: '',
    variants: []
  });
  const [selectedVariantId, setSelectedVariantId] = useState('');

 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setErrorMessage('You are not authorized!');
      setShowErrorModal(true);
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const catRes = await axios.get('http://localhost:3000/category/getAll', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCategories(catRes.data.Data);

        const prodRes = await axios.get(`http://localhost:3000/single/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const product = prodRes.data.message;

        setFormData({
          productName: product.productName,
          sku: product.sku,
          description: product.description,
          categoryId: product.category?._id || '',
          price: product.price || 0,
          image: product.image || '',
          variants: product.variants || []
        });

        const varRes = await axios.get('http://localhost:3000/vareint/getAll', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAllVariants(varRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage("Failed to fetch product details!");
        setShowErrorModal(true);
        if (!err.response) {
        setServerError(true);
      } else {
        setMessage(err.response?.data?.message || "Something went wrong");
      }
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' ? Number(value) : value });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][field] = field === "price" ? Number(value) : value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleAddVariant = () => {
    const newVariant = {
      _id: undefined,
      variant_name: '',
      variant_value: '',
      sku: '',
      price: 0,
      refundable: false
    };
    setFormData({ ...formData, variants: [...formData.variants, newVariant] });
  };

  const handleRemoveVariant = async (index) => {
    const variant = formData.variants[index];
    try {
      if (variant._id) {
        await axios.delete(`http://localhost:3000/vareint/${variant._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      const updatedVariants = [...formData.variants];
      updatedVariants.splice(index, 1);
      setFormData({ ...formData, variants: updatedVariants });
    } catch (error) {
      console.error("Error deleting variant:", error.response?.data || error.message);
      setErrorMessage("Failed to delete variant!");
      setShowErrorModal(true);
      if (!error.response) {
        setServerError(true);
      } else {
        setMessage(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  const handleVariantSelect = (e) => {
    setSelectedVariantId(e.target.value);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log(" Submitting update for product ID:", id);
   

    for (let v of formData.variants) {
      if (!v.variant_name || !v.variant_value) {
        setErrorMessage("Each variant must have a name and value!");
        setShowErrorModal(true);
        return;
      }
    }

   const payload = {
  productName: formData.productName,
  sku: formData.sku,
  description: formData.description,
  category: formData.categoryId,
  price: formData.price,
  image: formData.image,
  variants: formData.variants.map(v => ({
    _id: v._id,
    variant_name: v.variant_name.trim(),
    variant_value: v.variant_value.trim(),
    sku: v.sku?.trim() || '',
    price: v.price,
    refundable: v.refundable ?? false,
    quantity: v.quantity ?? 0,
    location: v.location || "Main"
  }))
};

    console.log("category",formData.categoryId);
   
    
    
 console.log("Payload being sent:", payload);
    await axios.put(`http://localhost:3000/update/${id}`, payload, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (selectedVariantId) {
      console.log(selectedVariantId)
      await axios.put(`http://localhost:3000/vareint/update/${selectedVariantId}`, {
        product_id: id
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }

    setShowSuccessModal(true);

  } catch (error) {
    console.error("Update request failed:", error.response?.data || error.message);
    setErrorMessage("Failed to update product!");
    setShowErrorModal(true);
    if (!error.response) {
        setServerError(true);
      } else {
        setMessage(error.response?.data?.message || "Something went wrong");
      }
  }
};

if (serverError) {
    return <ServerError />;
  }
  return (
    <div className="p-6 max-w-lg mx-auto mt-10 border rounded bg-stone-200">
      <h2 className="text-2xl font-bold mb-4">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name" className="w-full border p-2 rounded bg-white" />
        <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU" className="w-full border p-2 rounded bg-white" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded bg-white" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border p-2 rounded bg-white" />
        <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="w-full border p-2 rounded bg-white" />

        <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border p-2 rounded bg-white">
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>

        <select value={selectedVariantId} onChange={handleVariantSelect} className="w-full border p-2 rounded mt-2">
          <option value="">Select Variant to Assign</option>
          {allVariants.map(v => (
            <option key={v._id} value={v._id}>
              {v.varientName} - {v.variantValue} - ${v.price}
            </option>
          ))}
        </select>

        {formData.variants.map((v, index) => (
  <div key={index} className="p-3 border rounded bg-white space-y-2">
    <input
      type="text"
      value={v.variant_name}
      onChange={(e) => handleVariantChange(index, "variant_name", e.target.value)}
      placeholder="Variant Name"
      className="w-full border p-2 rounded"
    />
    <input
      type="text"
      value={v.variant_value}
      onChange={(e) => handleVariantChange(index, "variant_value", e.target.value)}
      placeholder="Variant Value"
      className="w-full border p-2 rounded"
    />
    <input
      type="text"
      value={v.sku || ""}
      onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
      placeholder="Variant SKU"
      className="w-full border p-2 rounded"
    />
    <input
      type="number"
      value={v.price}
      onChange={(e) => handleVariantChange(index, "price", Number(e.target.value))}
      placeholder="Variant Price"
      className="w-full border p-2 rounded"
    />
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={v.refundable ?? false}
        onChange={(e) => handleVariantChange(index, "refundable", e.target.checked)}
      />
      <span>Refundable</span>
    </label>

    {/* ✅ New fields */}
    <input
      type="number"
      value={v.quantity ?? 0}
      onChange={(e) => handleVariantChange(index, "quantity", Number(e.target.value))}
      placeholder="Variant Quantity"
      className="w-full border p-2 rounded"
    />
    <input
      type="text"
      value={v.location || ""}
      onChange={(e) => handleVariantChange(index, "location", e.target.value)}
      placeholder="Variant Location"
      className="w-full border p-2 rounded"
    />

    <button
      type="button"
      onClick={() => handleRemoveVariant(index)}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
    >
      Remove
    </button>
  </div>
))}


        <button type="button" onClick={handleAddVariant} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Add Variant
        </button>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4">
          Update Product
        </button>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <img src="check.png" alt="success" className="w-12 h-12 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Product Updated Successfully!
            </h2>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/home'); 
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

  
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center">
            <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;
