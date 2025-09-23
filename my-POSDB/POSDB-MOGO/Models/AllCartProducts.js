const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  categoryName: { type: String },
  description: { type: String },
  productName: { type: String },
  quantity: { type: Number, default: 1 },
  selectedVariant: { type: Object },  
  sku: { type: String }
         
}, { collection: "ProductCart", timestamps: true });


module.exports=mongoose.model("ProductCart",cardSchema);