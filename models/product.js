// models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    altName: { type: [String], default: [] },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    labeledPrice: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    // IMPORTANT: your exact spelling
    isAvailble: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
