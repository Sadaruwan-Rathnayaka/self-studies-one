// routes/orderRouter.js
import express from "express";
import { createOrder, getOrdersByUser } from "../controler/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/my", getOrdersByUser);

export default orderRouter;
