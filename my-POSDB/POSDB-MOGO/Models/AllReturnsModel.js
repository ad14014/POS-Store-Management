const mongoose = require('mongoose');

const returnOrderSchema = new mongoose.Schema({
  originalOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  returnedItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    variant: {
      _id: mongoose.Schema.Types.ObjectId,
      variant_name: String,
      variant_value: String,
      sku: String,
      price: Number
    },
    originalQuantity: {
      type: Number,
      required: true
    },
    returnedQuantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    sku: {
      type: String,
      required: true
    }
   
  }],
  returnDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Rejected', 'Refunded','Approved'],
    default: 'Approved'
  },
  totalRefund: {
    type: Number,
    required: true
  },
  processedBy: {
    type: String,
    default: 'System'
  },
  reason: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReturnOrder', returnOrderSchema);