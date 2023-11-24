const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;
const orderSchema = new Schema({
  order_id: {
    type: String,
    unique: true,
    required: true,
  },
  user_id: {
    type: ObjectId,
    required: true,
  },

  products: [
    {
      productId: {
        type: ObjectId,
        required: true,
        ref: 'books',
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
 
  orderStatus: {
    type: String,
    default: 'Pending',
  },
  order_placed_on: {
    type: String,
    required: true,
  },

}, )

const Orders = mongoose.model('order', orderSchema);
module.exports = Orders;