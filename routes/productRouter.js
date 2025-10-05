import express from "express";

import { deleteProducts, getProducts,saveProducts } from "../controler/productController.js";

const productRouter=express.Router();

productRouter.get("/",getProducts);
productRouter.post("/",saveProducts);
productRouter.delete("/:productId",deleteProducts)

export default productRouter;