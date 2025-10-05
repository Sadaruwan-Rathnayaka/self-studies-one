import express from "express";
import {creteUser, loginUser} from '../controler/userController.js';


const userRouter=express.Router();
userRouter.post("/",creteUser)
userRouter.post("/login",loginUser)

export default userRouter;