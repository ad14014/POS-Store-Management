import axios from "axios";
import React, { useEffect, useState } from "react";

const AllReturnOrders = () => {
  const [customerEmail, setCustomeremail] = useState([]);
  const [AllCustomerOrders, setAllCustomerOrders] = useState([]);
  const [ReturnEmail, setReturnEmail] = useState("");
  const [ErrorModal, setErrorModal] = useState(false);

  const [Variant_ID, setVariant_ID] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeReturnItem, setActiveReturnItem] = useState(null);

  const [Reason, setReason] = useState("");
  const [quantity, setquantity] = useState(1);
  const [refundamount, setrefundamount] = useState(0);

  
  useEffect(() => {
    if (selectedVariant && quantity > 0) {
      setrefundamount(selectedVariant.price * quantity);
    } else {
      setrefundamount(0);
    }
  }, [selectedVariant, quantity]);

  const GetAllCustomerEmail = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/return/get/AllReturn"
      );
      const res = response.data.Data.map((Email) => Email.customerEmail);
      setCustomeremail(res);
    } catch (error) {
      console.log("This is email Error:", error);
    }
  };

  useEffect(() => {
    GetAllCustomerEmail();
  }, []);

  const HandleCustomerOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/return/orders/${ReturnEmail}`
      );
      setAllCustomerOrders(response.data.orders);
      console.log(response.data.orders);
    } catch (error) {
      console.log("This is Error:", error);
      setErrorModal(true);
    }
  };

  const handleSubmitReturn = async (orderId, itemId) => {
    const payload = {
      orderId,
      itemId,
      variantId: Variant_ID,
      quantity,
      reason: Reason,
      refundAmount: refundamount, 
    };
    console.log("this is data:", payload);

    try {
      const response = await axios.post(
        "http://localhost:3000/return/create/return",
        payload
      );
      console.log("Return submitted successfully:", response.data);
      alert("Return request submitted successfully!");
      setActiveReturnItem(null);
      setSelectedVariant(null);
      setVariant_ID("");
      setReason("");
      setquantity(1);
      setrefundamount(0);
    } catch (error) {
      console.error("Error submitting return:", error);
      alert("Failed to submit return request.");
    }
  };

  if (ErrorModal === true)
    return (
      <div>
        <h3>Error fetching customer email!</h3>
        <button onClick={() => setErrorModal(false)}>Ok</button>
      </div>
    );

  return (
    <div className="mt-20">
      <form
        className="max-w-sm mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          HandleCustomerOrders();
        }}
      >
        <select
          value={ReturnEmail}
          onChange={(e) => setReturnEmail(e.target.value)}
          className="border p-2 rounded w-full bg-white"
        >
          <option value="">Choose a customer</option>
          {customerEmail.map((email, index) => (
            <option key={index} value={email}>
              {email}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Get Orders
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
        {AllCustomerOrders.map((order) => (
          <div key={order._id} className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Order ID: <span className="text-blue-600">{order._id}</span>
            </h2>
            <p className="text-gray-600">{order.customerName}</p>
            <p className="text-gray-600">{order.customerEmail}</p>
            <strong>Total Amount:</strong><p className="text-green-600 text-2xl">{order.totalPrice}</p>
            {order.cartItems.map((item) => (
              <div
                key={item._id}
                className="p-3 mt-3 border rounded-lg bg-gray-50"
              >
                <h4 className="font-bold">{item.productName}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>

                {activeReturnItem !== item._id ? (
                  <button
                    onClick={() => setActiveReturnItem(item._id)}
                    className="mt-3 bg-red-600 text-white py-1 px-3 rounded-lg"
                  >
                    Return Item
                  </button>
                ) : (
                  <div className="mt-3 space-y-3">
                   
                    <select
                      className="w-full border p-2 rounded"
                      value={Variant_ID}
                      onChange={(e) => {
                        const variantId = e.target.value;
                        setVariant_ID(variantId);

                        
                        let selected;
                        if (Array.isArray(item.selectedVariant)) {
                          selected = item.selectedVariant.find(
                            (v) => v._id === variantId
                          );
                        } else {
                          selected = item.selectedVariant;
                        }
                        setSelectedVariant(selected || null);
                      }}
                    >
                      <option value="">-- Select Variant --</option>

                      {Array.isArray(item.selectedVariant) &&
                        item.selectedVariant.map((variant) => (
                          <option key={variant._id} value={variant._id}>
                            {variant.variant_name} - {variant.variant_value} (₹
                            {variant.price})
                          </option>
                        ))}

                      {!Array.isArray(item.selectedVariant) &&
                        item.selectedVariant && (
                          <option value={item.selectedVariant._id}>
                            {item.selectedVariant.variant_name} -{" "}
                            {item.selectedVariant.variant_value} (₹
                            {item.selectedVariant.price})
                          </option>
                        )}
                    </select>

                   
                    <input
                      type="number"
                      min={1}
                      max={item.quantity}
                      value={quantity}
                      onChange={(e) => setquantity(Number(e.target.value))}
                      className="w-full border p-2 rounded"
                    />

                    {quantity > item.quantity && (
                      <div className="text-red-500 font-medium">
                        You have entered wrong Quantity
                      </div>
                    )}

                   
                    <div className="text-green-700 font-bold">
                      Refund Amount: ₹{refundamount}
                    </div>

                  
                    <textarea
                      placeholder="Enter reason for return"
                      value={Reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full border p-2 rounded"
                    />

                    <button
                      onClick={() => handleSubmitReturn(order._id, item._id)}
                      className={`w-full py-1 rounded-lg text-white ${
                        quantity > item.quantity || !Variant_ID
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600"
                      }`}
                      disabled={quantity > item.quantity || !Variant_ID}
                    >
                      Submit Return Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
       
       
       ))}
      </div>
    </div>
  );
};

export default AllReturnOrders;
