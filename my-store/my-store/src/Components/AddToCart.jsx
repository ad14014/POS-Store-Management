import React, { useEffect, useState,useRef} from "react";
import axios from "axios";
import ServerError from "./ServerError";


const Cart = () => {

  const token= localStorage.getItem("token")
  const adminemail=JSON.parse(localStorage.getItem("user"))
       if(!token) return alert('You are not Authorize for this Page!!')
        const [serverError, setServerError] = useState(false);
        
  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
 const [Bill,setBill]=useState([])
  const billRef = useRef(null);
  const [customerName, setCustomerName] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [cartItems, setCartItems] = useState([]);
  const [discounts, setDiscount] = useState([]);
  const [postedBy, setpostedBy] = useState(adminemail);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [ShowBill,setShowBill]=useState(false)
  const [cartLoading, setCartLoading] = useState(false);

  const mode = ["Online", "Cash"];
  const action = ["Active", "Pending", "Failure"];
  const billNumber = Math.floor(10000 + Math.random() * 90000);
 
 

 console.log(quantity);
 
  useEffect(() => {
    const fetchProducts = async () => {
    
      try {
        const res = await axios.get("http://localhost:3000/getAll", {
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      });
        const res2 = await axios.get("http://localhost:3000/discount/getAll", {
        headers: { "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}` 
         }
      });
        setProducts(res.data.Data);
        setDiscount(res2.data.Data);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (!error.response) {
        setServerError(true);
      } else {
        setMessage(error.response?.data?.message || "Something went wrong");
      }
      }
    };
    fetchProducts();
  }, []);

  
  if (serverError) {
    return <ServerError />;}
  
const handleAddToCart = async () => {
  try {
    setCartLoading(true);

    if (!selectedProductId) {
      alert("Please select a product first.");
      return;
    }

    const product = products.find((p) => p._id === selectedProductId);
    if (!product) {
      alert("Invalid product selected.");
      return;
    }

    if (!selectedVariantId) {
      alert("Please select a variant.");
      return;
    }

    const variant = product.variants.find((v) => v._id === selectedVariantId);
    if (!variant) {
      alert("Invalid variant selected.");
      return;
    }

    // ✅ find discount
    const discount = discounts.find((d) => d.variant_id?._id === variant._id);

    let discountedPrice = variant.price;
    if (discount) {
      discountedPrice = variant.price - (variant.price * discount.value) / 100;
    }

    // ✅ include _id so backend can find inventory
    const newItem = {
      ...product,
      selectedVariant: {
        _id: variant._id, // 👈 important
        variant_name: variant.variant_name,
        variant_value: variant.variant_value,
        price: variant.price,
        discountedPrice,
      },
      quantity,
    };

    const updatedCart = [...cartItems, newItem];
    setCartItems(updatedCart);
    console.log("this is payload:", newItem);

    await axios.post("http://localhost:3000/cart", newItem, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Product added to cart!");
  } catch (error) {
    console.log("This is error", error.message);
    alert("Please Enter Valid Quantity");
  } finally {
    setCartLoading(false);
  }
};





const totalPrice = cartItems.reduce((total, item) => {
  const price =
    item.selectedVariant.discountedPrice || item.selectedVariant.price || 0;
  return total + price * item.quantity;
}, 0);

const GSTTax=totalPrice*18/100;
const ServiceTax=totalPrice*10/100;
let discountAmount = 0;
if (totalPrice >= 20000) {
  discountAmount = 6000;
} else if (totalPrice >= 10000) {
  discountAmount = 3000;
}

const finalPrice = totalPrice - discountAmount+GSTTax+ServiceTax;


const HandleOrder = async (e) => {
  e.preventDefault();

  if (!customerEmail) {
    alert("Please enter your email before placing the order.");
    return;
  }

  const orderData = {
    cartItems,
    finalPrice,
    totalPrice,
    customerName,
    status,
    paymentMode,
    customerEmail,
    amount,
    address,
    phoneNumber,
    postedBy: adminemail,
    date: new Date().toISOString(),
  };
  console.log("orderdetails", orderData);

  try {
    setLoading(true)
    await axios.post("http://localhost:3000/order/create", orderData, {
      headers: { 
        "ngrok-skip-browser-warning": "true",
        'Authorization': `Bearer ${token}` 
      }
    });
    alert("Order Placed!!");
    if(alert) setLoading(false);
    setBill(orderData);
    setShowBill(true);
    setShowOrderForm(false);
  } catch (error) {
    console.error("Order error:", error);
    alert("Failed to place order.");
  } 

};


   const printBill = () => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${Bill.customerName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f9fafb;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .invoice-header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #3b82f6;
          }
          .invoice-header h1 {
            margin: 0;
            font-size: 28px;
            color: #1e40af;
          }
          .invoice-header p {
            margin: 4px 0;
            color: #6b7280;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            font-size: 14px;
          }
          .invoice-details div p {
            margin: 4px 0;
          }
          h3 {
            margin: 15px 0;
            font-size: 18px;
            color: #1f2937;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 14px;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: center;
          }
          th {
            background: #dbeafe;
            color: #1e40af;
          }
          tr:nth-child(even) {
            background: #f9fafb;
          }
          .invoice-totals {
            text-align: right;
            background: #f3f4f6;
            border-radius: 8px;
            padding: 15px;
            font-size: 14px;
          }
          .invoice-totals p {
            margin: 5px 0;
          }
          .invoice-totals .final {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            margin-top: 10px;
          }
          .invoice-footer {
            text-align: center;
            border-top: 1px solid #e5e7eb;
            margin-top: 25px;
            padding-top: 10px;
            font-size: 12px;
            color: #6b7280;
          }
          @media print {
            body {
              background: #fff;
              padding: 0;
            }
            .invoice-container {
              box-shadow: none;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="invoice-header">
            <h1>🛒 Order Invoice</h1>
            <p>Thank you for shopping with us!</p>
          </div>

          <!-- Details -->
          <div class="invoice-details">
            <div>
              <p><strong>Bill No:</strong> #${billNumber}</p>
              <p><strong>Name:</strong> ${Bill.customerName}</p>
              <p><strong>Email:</strong> ${Bill.customerEmail}</p>
              <p><strong>Phone:</strong> ${Bill.phoneNumber}</p>
              <p><strong>Address:</strong> ${Bill.address}</p>
            </div>
            <div style="text-align:right;">
              <p><strong>Posted By:</strong> ${Bill.postedBy}</p>
              <p><strong>Status:</strong> ${Bill.status}</p>
              <p><strong>Payment Mode:</strong> ${Bill.paymentMode}</p>
              <p><strong>Date:</strong> ${new Date(Bill.date).toLocaleString()}</p>
            </div>
          </div>

          <!-- Items -->
          <h3>🛍️ Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${Bill.cartItems.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.selectedVariant.variant_name} - ${item.selectedVariant.variant_value}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.selectedVariant.discountedPrice || item.selectedVariant.price}</td>
                  <td>$${(item.selectedVariant.discountedPrice || item.selectedVariant.price) * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="invoice-totals">
            <p><strong>Total Price:</strong> $${Bill.totalPrice}</p>
            ${Bill.finalPrice !== Bill.totalPrice ? `
              <p style="color:green;"><strong>Discount:</strong> -$${Bill.totalPrice - Bill.finalPrice}</p>
            ` : ''}
            <p><strong>GST (18%):</strong> $${GSTTax.toFixed(2)}</p>
            <p><strong>Service Tax (10%):</strong> $${ServiceTax.toFixed(2)}</p>
            <p><strong>Paid Amount:</strong> $${Bill.amount}</p>
            <p class="final">Final Amount: $${finalPrice.toFixed(2)}</p>
          </div>

          <!-- Footer -->
          <div class="invoice-footer">
            <p>✨ Thank you for your purchase! ✨</p>
            <p>For support, contact: support@yourshop.com</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            // window.onafterprint = function() { window.close(); }
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

  
  return (
   <div className="p-6 z-10">
      <h1
        className="text-2xl font-bold mb-4 mt-14 p-3 flex justify-center bg-white text-black rounded-2xl "
        style={{ boxShadow: "0 3px 10px black" }}
      >
        Select Products for Cart
      </h1>

   
      <div className="z-10 w-80 mb-4">
        <button
          onClick={() => setShowProductDropdown(!showProductDropdown)}
          className="border-2 border-black rounded-lg  p-2 w-80 text-left bg-white"
        >
          {selectedProductId
            ? products.find((p) => p._id === selectedProductId).productName
            : "Select a product..."}
        </button>

        {showProductDropdown && (
          <div className="absolute  mt-1 w-80 bg-white border-2 border-black rounded-lg shadow-lg max-h-80 overflow-auto">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => {
                  setSelectedProductId(product._id);
                  setSelectedVariantId("");
                  setShowProductDropdown(false);
                }}
                className="flex flex-col items-center border-b border-gray-200 p-4 hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src="products.png"
                  alt={product.productName}
                  className="w-32 h-32 object-contain mb-4"
                />
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {product.productName}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {product.categoryName}
                </p>
                <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProductId && (
        <>
          <label className="block mb-1 font-medium">Choose Variant:</label>
          <select
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="border border-white bg-white rounded-lg p-2 w-60 mb-4"
          >
            <option value="">Select variant...</option>
            {products
              .find((p) => p._id === selectedProductId)
              ?.variants.map((variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.variant_name} - {variant.variant_value} (${variant.price})
                </option>
              ))}
          </select>
        </>
      )}

      
      {selectedProductId && (
        <>
          <label className="block mb-1 font-medium">Quantity:</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 w-24 mb-4"
          />
        </>
      )}

      <button
        onClick={handleAddToCart}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Add to Cart
      </button>
      {cartLoading && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[1, 2, 3].map((n) => (
      <div
        key={n}
        className="bg-gray-200 animate-pulse rounded-xl p-4 h-60"
      >
        <div className="bg-gray-300 h-32 w-full rounded-lg mb-4"></div>
        <div className="bg-gray-300 h-4 w-3/4 mb-2"></div>
        <div className="bg-gray-300 h-4 w-1/2"></div>
      </div>
    ))}
  </div>
)}


      
      {cartItems.length !== 0 ? (
        <h1
          className="text-2xl font-bold mb-4 mt-10 p-3 flex justify-center bg-white text-black rounded-2xl "
          style={{ boxShadow: "0 3px 10px black" }}
        >
          Saved Cart Product
        </h1>
      ) : (
        <h1
          className="text-2xl font-bold mb-4 mt-10 p-3 flex justify-center bg-white text-black rounded-2xl "
          style={{ boxShadow: "0 3px 10px black" }}
        >
          No Product Yet!!
        </h1>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cartItems.map((product, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-center text-center"
            style={{ boxShadow: "0 10px 20px black" }}
          >
            <img
              src="products.png"
              alt={product.productName}
              className="w-32 h-32 object-contain mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {product.productName}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{product.categoryName}</p>
            <p className="text-sm text-gray-500 mb-2">{product.sku}</p>

            
            {product.selectedVariant && (
              <div className="mt-3 w-full flex flex-wrap justify-center gap-2">
                <span
                  style={{ backgroundColor: "green" }}
                  className="m-1 text-white rounded-lg px-1"
                >
                  {product.selectedVariant.variant_name}
                </span>
                <span
                  style={{ backgroundColor: "purple" }}
                  className="m-1 text-white rounded-lg px-1"
                >
                  {product.selectedVariant.variant_value}
                </span>

                <div className="ml-2 text-black text-m font-bold">
                  {product.selectedVariant.discountedPrice &&
                  product.selectedVariant.discountedPrice !==
                    product.selectedVariant.price ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "red",
                          marginRight: "8px",
                        }}
                      >
                        ${product.selectedVariant.price * product.quantity}
                      </span>
                      <span className="text-green-600">
                        ${product.selectedVariant.discountedPrice * product.quantity}
                      </span>
                    </>
                  ) : (
                    <>${product.selectedVariant.price * product.quantity}</>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

   
      {cartItems.length > 0 && (
        <>
          <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-800">
              Total Price: ${totalPrice}
            </h2>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg"
            >
              Proceed to Order
            </button>
          </div>
        </>
      )}

     
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-150 bg-white h-full shadow-2xl p-6 overflow-y-auto transition-transform duration-300">
            <button
              onClick={() => setShowOrderForm(false)}
              className="text-red-500 font-bold text-lg mb-4"
            >
              Close
            </button>

            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {cartItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 shadow-md bg-gray-50"
              >
                <h3 className="font-bold">{item.productName}</h3>
                <p>Variant: {item.selectedVariant?.variant_name}</p>
                <p>Value: {item.selectedVariant?.variant_value}</p>
                <p>Quantity: {item.quantity}</p>

               
                {item.selectedVariant?.discountedPrice &&
                item.selectedVariant.discountedPrice !==
                  item.selectedVariant.price ? (
                  <>
                    <p>
                      Price:{" "}
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "red",
                          marginRight: "8px",
                        }}
                      >
                        ${item.selectedVariant.price}
                      </span>
                      <span className="text-green-600 font-bold">
                        ${item.selectedVariant.discountedPrice}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Subtotal:{" "}
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "red",
                          marginRight: "8px",
                        }}
                      >
                        ${item.selectedVariant.price * item.quantity}
                      </span>
                      <span className="text-green-600 font-bold">
                        ${item.selectedVariant.discountedPrice * item.quantity}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="font-semibold">
                    Subtotal: ${item.selectedVariant?.price * item.quantity}
                  </p>
                )}
              </div>
            ))}
            <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center">
  <h2 className="text-xl font-bold text-gray-800">
    Total Price: ${totalPrice}
  </h2>
  {discountAmount > 0 && (
    <h4 className="text-xl font-bold text-green-600">
      Discount: -${discountAmount}
    </h4>
  )}
  <h4 className="text-l font-bold text-black">
    GST Tax:+${GSTTax}
  </h4>
  <h2 className="text-l font-bold text-black">
    Service Tax: +${ServiceTax}
  </h2>
  <h2 className="text-2xl font-bold text-black">
    Final Amount: ${finalPrice}
  </h2>
</div>
           
            <form className="mt-6">
              <label className="block mb-2 font-medium">Customer Name:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter your name"
              />
              <label className="block mb-2 font-medium">Customer Email:</label>
              <input
                type="text"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter your Email"
              />
              <label className="block mb-2 font-medium">Status:</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                className="w-full border rounded p-2 mb-4"
              >
                <option className="disabled">select item</option>
                {action.map((act) => (
                  <option key={act}>{act}</option>
                ))}
              </select>
              <label className="block mb-2 font-medium">Payment:</label>
              <select
                value={paymentMode}
                onChange={(e) => {
                  setPaymentMode(e.target.value);
                }}
                className="w-full border rounded p-2 mb-4"
              >
                <option className="disabled">select item</option>
                {mode.map((act) => (
                  <option key={act}>{act}</option>
                ))}
              </select>

              {paymentMode === "Online" && (
                <div className="mb-2">
                  <label
                    htmlFor="amt"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Online Amount
                  </label>
                  <input
                    type="text"
                    id="amt"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="shadow-xs bg-gray-50 border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              )}
              {paymentMode === "Cash" && (
                <div className="mb-2">
                  <label
                    htmlFor="onamt"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Cash Amount
                  </label>
                  <input
                    type="text"
                    id="onamt"
                    value={finalPrice}
                    onChange={(e) => setAmount(e.target.value)}
                    className="shadow-xs bg-gray-50 border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              )}
              <label className="block mb-2 font-medium">Address:</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter delivery address"
              />

              <label className="block mb-2 font-medium">Phone Number:</label>
              <input
                type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter your phone"
              />
               <label className="block mb-2 font-medium">PostedBy:</label>
              <input
                type="text"
                value={postedBy}
                onChange={(e) => setpostedBy(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                placeholder="Enter your email"
              />

           <button
  type="submit"
  onClick={HandleOrder}
  className="bg-blue-600 text-white w-full py-2 rounded-lg flex justify-center items-center gap-2 disabled:opacity-70"
  disabled={loading}
>
  {loading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Placing Order...
    </>
  ) : (
    "Place Order"
  )}
</button>

            </form>
          </div>

        </div>
      )}
      {ShowBill && Bill && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center  justify-center z-50">
   <div
  ref={billRef}
  className="bg-white rounded-2xl shadow-2xl w-4/5 max-w-3xl h-[90vh] overflow-y-auto p-8 relative"
>
      
      <button
        onClick={() => setShowBill(false)}
        className="absolute top-4 right-4 text-red-500 font-bold text-xl"
      >
        ✕
      </button>

      
      <div className="text-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-blue-700">🛒 Order Invoice</h1>
        <p className="text-gray-500">Thank you for shopping with us!</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
        <div className="space-y-1">
          <p><strong>Bill No:</strong> #{billNumber}</p>
          <p><strong>Name:</strong> {Bill.customerName}</p>
          <p><strong>Email:</strong> {Bill.customerEmail}</p>
          <p><strong>Phone:</strong> {Bill.phoneNumber}</p>
          <p><strong>Address:</strong> {Bill.address}</p>
        </div>
        <div className="space-y-1 text-right">
          <p><strong>Posted By:</strong> {Bill.postedBy}</p>
          <p><strong>Status:</strong> {Bill.status}</p>
          <p><strong>Payment Mode:</strong> {Bill.paymentMode}</p>
          <p><strong>Date:</strong> {new Date(Bill.date).toLocaleString()}</p>
        </div>
      </div>

     
      <h3 className="text-lg font-semibold mb-3">🛍️ Order Items</h3>
      <table className="w-full border-collapse border border-gray-300 mb-6 text-sm">
        <thead>
          <tr className="bg-blue-100 text-blue-800">
            <th className="border border-gray-300 p-2">Product</th>
            <th className="border border-gray-300 p-2">Variant</th>
            <th className="border border-gray-300 p-2">Qty</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {Bill.cartItems.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="border border-gray-300 p-2">{item.productName}</td>
              <td className="border border-gray-300 p-2">
                {item.selectedVariant.variant_name} -{" "}
                {item.selectedVariant.variant_value}
              </td>
              <td className="border border-gray-300 p-2">{item.quantity}</td>
              <td className="border border-gray-300 p-2">
                ${item.selectedVariant.discountedPrice || item.selectedVariant.price}
              </td>
              <td className="border border-gray-300 p-2">
                $
                {(item.selectedVariant.discountedPrice || item.selectedVariant.price) *
                  item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      <div className="bg-gray-100 rounded-lg p-4 text-right space-y-1">
        <p><strong>Total Price:</strong> ${Bill.totalPrice}</p>
        {Bill.finalPrice !== Bill.totalPrice && (
          <p className="text-green-600">
            <strong>Discount:</strong> -${Bill.totalPrice - Bill.finalPrice}
          </p>
        )}
        <p><strong>GST (18%):</strong> ${GSTTax.toFixed(2)}</p>
        <p><strong>Service Tax (10%):</strong> ${ServiceTax.toFixed(2)}</p>
        <p><strong>Paid Amount:</strong> ${Bill.amount}</p>
        <p className="text-xl font-bold text-blue-700 mt-2">
          Final Amount: ${finalPrice.toFixed(2)}
        </p>
      </div>

      
      <div className="text-center mt-6 border-t pt-4 text-gray-500 text-sm">
        <p>✨ Thank you for your purchase! ✨</p>
        <p>For support, contact: adnansiddiqui@gmail.com</p>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={printBill}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
        >
          Download Invoice
        </button>
      </div>
    </div>
  </div>
)}
  
      {loading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
      <svg
        className="animate-spin h-10 w-10 text-blue-600 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="text-lg font-semibold text-gray-700">Placing your order...</p>
    </div>
  </div>
)}
</div>
  );
};

export default Cart;