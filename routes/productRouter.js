// routes/productRouter.js
import express from "express";
import {
  deleteProducts,
  getProductById,
  getProducts,
  saveProducts,
  updateProduct
} from "../controler/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);           // list all
productRouter.post("/", saveProducts);         // add
productRouter.delete("/:productId", deleteProducts); // delete
productRouter.put("/:productId", updateProduct);     // update
productRouter.get("/:productId", getProductById);    // get one

export default productRouter;
