const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllProductVarient",
      required: true,
    },
  },
  { collection: "Discount"}
);

module.exports = mongoose.model("Discount", DiscountSchema);