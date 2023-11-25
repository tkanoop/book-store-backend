const mongoose=require('mongoose')
const { Schema } = mongoose;
const { ObjectId } = Schema;
const cartSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    product: [
      {
        productId: {
          type: ObjectId,

          required: true,
          ref: 'Book'
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },

);

const Cart = mongoose.model('cart', cartSchema);
module.exports = {Cart};