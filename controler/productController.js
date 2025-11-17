// controllers/productController.js
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

// Helper to normalize request body fields
function normalizeProductInput(body = {}) {
  const {
    productId,
    name,
    altName = [],
    description,
    images = [],
    labeledPrice = 0,
    price = 0,
    stock = 0,
    // accept either isAvailable (frontend) or isAvailble (db)
    
    isAvailble
  } = body;

  // prefer explicit isAvailble if provided, otherwise map isAvailable -> isAvailble
  const finalIsAvailble = (typeof isAvailble !== "undefined")
    ? Boolean(isAvailble)
    : (typeof isAvailable !== "undefined" ? Boolean(isAvailable) : undefined);

  return {
    productId,
    name,
    altName: Array.isArray(altName) ? altName : [String(altName)],
    description: description || "",
    images: Array.isArray(images) ? images : [String(images || "")],
    labeledPrice: Number(labeledPrice) || 0,
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    isAvailble: finalIsAvailble
  };
}

// GET /products
export async function getProducts(req, res) {
  try {
    // Use DB field name isAvailble
    const filter = isAdmin(req) ? {} : { isAvailble: true };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error("GET /products error:", err);
    return res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
}

// POST /products
export async function saveProducts(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "You are not authorized to add a product" });
    }

    const input = normalizeProductInput(req.body);
    const { productId, name, description } = input;

    if (!productId || !name || !description) {
      return res.status(400).json({ message: "Missing required fields: productId, name, description" });
    }

    // Check existing
    const existing = await Product.findOne({ productId });
    if (existing) {
      return res.status(409).json({ message: "productId already exists" });
    }

    // If isAvailble was not provided, default to true
    if (typeof input.isAvailble === "undefined") input.isAvailble = true;

    const product = new Product(input);
    const saved = await product.save();
    return res.status(201).json(saved);

  } catch (err) {
    console.error("POST /products error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "productId already exists", error: err.keyValue });
    }
    return res.status(500).json({ message: "Failed to add product", error: err.message });
  }
}

// DELETE /products/:productId
export async function deleteProducts(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "You are not authorized to delete a product" });
    }

    const result = await Product.deleteOne({ productId: req.params.productId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE /products error:", err);
    return res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
}

// PUT /products/:productId
export async function updateProduct(req, res) {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "You are not authorized to update products" });
    }

    const productId = req.params.productId;
    if (!productId) return res.status(400).json({ message: "Missing productId in params" });

    // Normalize body fields (handles isAvailable -> isAvailble)
    const input = normalizeProductInput(req.body);

    // Remove undefined keys so we don't overwrite with undefined
    const updateData = {};
    Object.keys(input).forEach(k => {
      if (typeof input[k] !== "undefined") updateData[k] = input[k];
    });

    // Use findOneAndUpdate to get updated doc
    const updated = await Product.findOneAndUpdate(
      { productId },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product updated successfully", product: updated });

  } catch (err) {
    console.error("PUT /products error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

// GET /products/:productId
export async function getProductById(req, res) {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Use DB field isAvailble
    if (product.isAvailble) return res.json(product);

    // product not available: only admin can see it
    if (!isAdmin(req)) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    console.error("GET /products/:id error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}
