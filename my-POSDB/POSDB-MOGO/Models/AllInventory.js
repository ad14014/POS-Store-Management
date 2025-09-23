const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  
{
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },

    location: {
      type: String,
      required: true,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "allproduct",
      required: true,
    },

    
    productVariant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllProductVarient",
      required: true,
    },
  },
  {collection:'AllInventery'}
);

module.exports = mongoose.model("Inventory", InventorySchema);
