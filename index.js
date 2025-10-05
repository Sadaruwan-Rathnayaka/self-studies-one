import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
//import Student from './models/student.js';
import Product from './models/product.js';
import User from './models/user.js';
//import studentRouter from './routes/studentRouter.js';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import  jwt  from 'jsonwebtoken';


//mongodb+srv://admin:123@cluster0.jlajdyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const app = express();

app.use(bodyParser.json())
app.use(
    (req,res,next)=>{
        const tokenString=req.header("Authorization")
        if(tokenString != null){
            const token=tokenString.replace("Bearer ","")
            

                    jwt.verify(token,"chamo",(err,decoded)=>{
                        if(decoded != null){
                            console.log(decoded)
                            req.user=decoded
                            next()
                        } else{
                            console.log("invalid token")
                            res.status(403).json({
                                message:"invalid token"
                            })
                        }
                    })
        } else {
            next()
        }
    
    }
)



mongoose.connect("mongodb+srv://admin:123@cluster0.jlajdyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
console.log("connected to the database")
}).catch(()=>{
    console.log("database conenction failed")
})


app.use("/products",productRouter)
app.use("/users",userRouter)

app.listen(5002, () => {
    console.log('Server is running on port 5002');
})


