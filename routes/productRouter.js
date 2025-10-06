import express from "express";

import { deleteProducts, getProductById, getProducts,saveProducts, updateProduct } from "../controler/productController.js";

const productRouter=express.Router();

productRouter.get("/",getProducts);
productRouter.post("/",saveProducts);
productRouter.delete("/:productId",deleteProducts)
productRouter.put("/:productId",updateProduct)
productRouter.get("/:productId",getProductById)

export default productRouter;