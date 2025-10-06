import Product from "../models/product.js";
import productRouter from './../routes/productRouter.js';
import { isAdmin } from "./userController.js";
//import { async } from './productController.js';

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

export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to update products "
        })
        return
    }
    const productId = req.params.productId
    const updatingData = req.body

    try{
        await Product.updateOne(
            {productId:productId},
            updatingData
    )
    res.json(
        {message : "product updated successfully"}
    )
        }
            catch(err){
        res.status(500).json({
            message : "internal server error",
            error:err
        })
    }
}

export async function getProductById (req,res){
    const productId=req.params.productId
    const admin=isAdmin(req)


    try{
const product = await Product.findOne(
    {productId:productId}
)
    if(product==null){
        res.status(404).json(
            {
                message :"product not found"
            }
        ); return
    }
    
    if(product.isAvailble){
        res.json(product)

    }else{
            if(!isAdmin(req)){
                res.status(404).json(
                    {
                        message : "product  not found"
                    }
                )
                return
            } else {
                res.json(product)
            }
    }

    }catch (err){
        res.status(500).json(
            {
                message: "Internal Server Eroor",
                error:err
            }
        )

    }
}
