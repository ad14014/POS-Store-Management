const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  variant_name: { type: String },
  variant_value: { type: String },
  price: { type: Number },
  discountedPrice: { type: Number }
}, { _id: false });

const CartItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  sku: { type: String },
  description: { type: String },
  category: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  selectedVariant: VariantSchema,
  quantity: { type: Number, default: 1 }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },

  cartItems: [CartItemSchema],

  totalPrice: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  amount: { type: Number, required: true }, // paid amount

  status: { 
    type: String, 
    enum: ["Active", "Pending", "Failure"], 
    default: "Pending" 
  },
  paymentMode: { 
    type: String, 
    enum: ["Online", "Cash"], 
    required: true 
  },

  postedBy: { type: String, required: true }, // admin email
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
