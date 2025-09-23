const Order = require('../Models/OrderSchema.js');
const ReturnOrder=require('../Models/AllReturnsModel.js')
const ProductVariant=require('../Models/AllProductVarient.js')
const Inventory=require('../Models/AllInventory.js')
const Cart=require('../Models/AllCartProducts.js')
exports.GetCustomersOrders= async (req, res) => {
  try {
    const { email } = req.params;
     

    const orders = await Order.find({ customerEmail: email });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.GetAllcustomerEmail=async(req,res)=>{
  try {
    const Allorders=await Order.find()
     res.status(201).json({ Data:Allorders});
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
}
exports.getAllReturnOrders = async (req, res) => {
  try {
    const returns = await ReturnOrder.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, returns });
  } catch (error) {
    res.status(500).json({ message: "Error fetching return orders", error: error.message });
  }
};

exports.getReturnOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const returns = await ReturnOrder.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, returns });
  } catch (error) {
    res.status(500).json({ message: "Error fetching return orders", error: error.message });
  }
};
exports.updateReturnStatus = async (req, res) => {
  try {
    const { returnId } = req.params;
    const { status } = req.body;

    const returnOrder = await ReturnOrder.findById(returnId);
    if (!returnOrder) return res.status(404).json({ message: "Return order not found" });

    returnOrder.status = status;
    await returnOrder.save();

    res.status(200).json({ message: "Status updated successfully", returnOrder });
  } catch (error) {
    console.error("Error updating return status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.CreateReturn = async (req, res) => {
  try {
    const { orderId, itemId, variantId, quantity, reason, refundAmount } = req.body;


    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.cartItems.find((ci) => String(ci._id) === String(itemId));
    if (!item) return res.status(404).json({ message: "Item not found in order" });

    if (quantity > item.quantity) {
      return res.status(400).json({ message: "Return quantity exceeds purchased quantity" });
    }

    const originalQty = item.quantity;

    await Inventory.findOneAndUpdate(
      { productVariant: variantId },
      { $inc: { quantity }, $set: { lastUpdated: new Date() } },
      { new: true }
    );

    
    const newTotalPrice = (Number(order.totalPrice) - Number(refundAmount))
    const newAmount = (Number(order.amount) - Number(refundAmount)).toFixed(2);

  
    let updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, "cartItems._id": itemId },
      {
        $inc: { "cartItems.$.quantity": -quantity }, 
        $set: {
          totalPrice: newTotalPrice,
          amount: newAmount,
        },
      },
      { new: true }
    );


    const updatedItem = updatedOrder.cartItems.find((ci) => String(ci._id) === String(itemId));
    if (updatedItem && updatedItem.quantity <= 0) {
      updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { $pull: { cartItems: { _id: itemId } } },
        { new: true }
      );
    }

   
    const returnOrder = new ReturnOrder({
      originalOrderId: order._id,
      customerEmail: order.customerEmail,
      returnedItems: [
        {
          productId: item._id,
          productName: item.productName,
          variant: item.selectedVariant || { _id: variantId },
          originalQuantity: originalQty,
          returnedQuantity: quantity,
          price: item.selectedVariant?.price || item.price,
          sku: item.sku,
        },
      ],
      totalRefund: refundAmount,
      reason,
      status: "Pending",
    });

    await returnOrder.save();

    res.status(201).json({
      message: "Return created successfully",
      returnOrder,
      updatedOrder,
    });
  } catch (error) {
    console.error("Error in submitReturn:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


