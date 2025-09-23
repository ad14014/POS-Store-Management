import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminReturnOrders = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, message: "", type: "" });
  const [searchEmail, setSearchEmail] = useState(""); // 🔍 new state

  const getReturns = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/return/all");
      setReturns(data.returns || []);
    } catch (error) {
      console.error("Error fetching return orders:", error);
      setModal({
        open: true,
        message: "Failed to fetch return orders",
        type: "error",
      });
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    getReturns();
  }, []);

  const updateStatus = async (returnId, status) => {
    try {
      await axios.put(
        `http://localhost:3000/return/update-status/${returnId}`,
        { status }
      );
      setModal({
        open: true,
        message: "Status updated successfully!",
        type: "success",
      });
      getReturns();
    } catch (err) {
      console.error("Error updating status:", err);
      setModal({
        open: true,
        message: "Failed to update status",
        type: "error",
      });
    }
  };

  // 🔍 filter returns by email
  const filteredReturns = returns.filter((r) =>
    r.customerEmail.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h2 className="text-center text-3xl font-extrabold mb-10 text-gray-800 mt-20">
        All Returned Orders
      </h2>

      
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by customer email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border px-4 py-2 rounded-lg w-80 shadow-sm bg-white"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : filteredReturns.length === 0 ? (
        <p className="text-center text-gray-500">No return orders found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReturns.map((r) => (
            <div
              key={r._id}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col border border-gray-100"
            >
              <p className="text-sm text-gray-600">Order: {r.originalOrderId}</p>
              <p className="font-bold text-gray-800">{r.customerEmail}</p>

              <div className="mt-2 space-y-1">
                {r.returnedItems.map((item, idx) => (
                  <p key={idx} className="text-xs text-red-600">
                    {item.productName} x{item.returnedQuantity} (₹{item.price})
                  </p>
                ))}
              </div>

              <p className="mt-2 text-green-600 font-semibold">
                Refund: ₹{r.totalRefund}
              </p>

              <select
                value={r.status}
                onChange={(e) => updateStatus(r._id, e.target.value)}
                className="mt-3 border px-3 py-2 rounded-lg text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          ))}
        </div>
      )}

     
      {modal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
            <h3
              className={`text-lg font-semibold ${
                modal.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {modal.type === "success" ? "✅ Success" : "❌ Error"}
            </h3>
            <p className="mt-2 text-gray-700">{modal.message}</p>
            <button
              onClick={() => setModal({ ...modal, open: false })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReturnOrders;
 