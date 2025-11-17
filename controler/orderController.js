// controllers/orderController.js
import Order from "../models/order.js";
import Product from "../models/product.js";

// Simple orderId generator (P000001, P000002, ...)
async function generateOrderId() {
  const last = await Order.findOne().sort({ createdAt: -1 }).lean();
  if (!last || !last.orderId) return "P000001";

  const num = parseInt(last.orderId.replace("P", ""), 10) || 0;
  return "P" + String(num + 1).padStart(6, "0");
}

export async function createOrder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login and try again." });
    }

    const orderInfo = req.body || {};

    if (!Array.isArray(orderInfo.products) || orderInfo.products.length === 0) {
      return res.status(400).json({ message: "No products provided." });
    }

    if (!orderInfo.name) {
      orderInfo.name = `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim();
    }

    const orderId = await generateOrderId();

    let total = 0;
    let labeledTotal = 0;
    const products = [];

    for (let i = 0; i < orderInfo.products.length; i++) {
      const p = orderInfo.products[i];

      if (!p || !p.productId || !p.quantity) {
        return res.status(400).json({ message: `Invalid product at index ${i}` });
      }

      const item = await Product.findOne({ productId: p.productId }).lean();
      if (!item) {
        return res.status(404).json({ message: `Product ${p.productId} not found` });
      }

      // your exact spelling: isAvailble
      if (item.isAvailble === false) {
        return res.status(400).json({ message: `Product ${p.productId} is not available` });
      }

      const qty = Number(p.quantity);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ message: `Invalid quantity for ${p.productId}` });
      }

      products.push({
        productInfo: {
          productId: item.productId,
          name: item.name,
          altName: item.altName || [],
          description: item.description || "",
          images: item.images || [],
          labeledPrice: Number(item.labeledPrice) || 0,
          price: Number(item.price) || 0
        },
        quantity: qty
      });

      total += (item.price || 0) * qty;
      labeledTotal += (item.labeledPrice || 0) * qty;
    }

    const order = new Order({
      orderId,
      email: req.user.email,
      name: orderInfo.name,
      address: orderInfo.address || "",
      phone: orderInfo.phone || "",
      products,
      total,
      labeledTotal
    });

    const created = await order.save();
    return res.status(201).json({
      message: "Order created",
      order: created
    });

  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function getOrdersByUser(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: "Please login." });

    const orders = await Order.find({ email: req.user.email }).sort({ createdAt: -1 });
    return res.json(orders);

  } catch (err) {
    console.error("getOrdersByUser error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
