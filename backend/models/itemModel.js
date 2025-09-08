import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      // We will use this category string for filtering
    },
    imageUrl: {
      type: String,
      required: false, // Make this required if you want, optional for speed
    },
    countInStock: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    // timestamps adds 'createdAt' and 'updatedAt' fields automatically
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);

export default Item;