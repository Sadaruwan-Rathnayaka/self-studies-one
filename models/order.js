// models/order.js
import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema(
  {
    productInfo: {
      productId: { type: String },
      name: { type: String },
      altName: { type: [String], default: [] },
      description: { type: String, default: "" },
      images: { type: [String], default: [] },
      labeledPrice: { type: Number, default: 0 },
      price: { type: Number, default: 0 }
    },
    quantity: { type: Number, required: true, default: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    products: { type: [orderProductSchema], default: [] },
    total: { type: Number, default: 0 },
    labeledTotal: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
