import Product from "../models/product.js";
import productRouter from './../routes/productRouter.js';
import { isAdmin } from "./userController.js";

export async function getProducts(req,res){

try{
    if(isAdmin(req)){
const products= await Product.find()
    res.json(products)
    }else{
        const products= await Product.find({isAvailble : true})
    res.json(products)
    }
    
}catch(err){
    res.json({
        message:'Failed',
        error:err
    })
}

}

export function saveProducts(req,res){
    
    if(!isAdmin(req)){
        res.status(403).json({
            message: "You are not aurthorized add a product "
        })
        return
    }

    const product=new Product(
        req.body
    );

product.save().then(()=>{
    res.json({
        message:"product added sucessfully",
    });
}).catch(()=>{
    res.json({
        message:"failed to add products"
    })
})

}

export  async function deleteProducts(req,res){
if(!isAdmin(req)){
    res.status(403).json({
        message:"you are not authorized to delete a product"
    });
    return
}
try {
await Product.deleteOne({productId:req.params.productId})

res.json({
    message : "product deleete succesfully"
})

}
catch(err){
    res.status(501).json({
        message: "failed to delete products",
        error:err
    })
}
}
