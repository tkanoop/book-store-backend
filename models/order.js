const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;
const orderSchema = new Schema({

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
    default:'COD'
  },
 

 
  order_placed_on: {
    type: String,
    required: true,
  },  

}, )

const Order = mongoose.model('order', orderSchema);
module.exports = {Order};