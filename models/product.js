import mongoose from "mongoose";


const productschems=mongoose.Schema(
    { 
        productId : {
            type:String,
            required:true,
            unique:true
        },
        
            name: {
            type:String,
            required:true,
            },

            altName : [{
            type:String    
            }],

            description : {
            type:String,
            required:true 
            },

            images :[{
            type : String
            }],

            labeledPrice : {
            type:Number,
            required:true   
            },

            price : {
                type :Number,
                required:true
            },

            stock : {
                type:Number,
                required:true
            },

            isAvailble : {
                type:Boolean,
                required:true,
                default:true
            },
        });


        
    

const Product =mongoose.model("products",productschems)

export default Product;