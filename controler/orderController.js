
import Order from '../models/order.js';
import Product from '../models/product.js';

export async function createOrder(req,res){
    
    //get user information

    if (req.user==null){
        res.status(403).json({
            message : "plese login and try againn later"
        })
        return
    }

    const orderInfo = req.body
    if(orderInfo.name==null){
        orderInfo.name=req.user.firstName+" "+req.user.lastName
    }

    //P000001
    let orderId="P000001"
    const lastOrder = await Order.find().sort({date:-1}).limit(1)
    //[]

    if(lastOrder.length > 0){
        const lastOrderId = lastOrder[0].orderId
        const lastOrderNumberString=lastOrderId.replace("P","")
        const lastOrderNumber=parseInt(lastOrderNumberString)
        const newOrderNumber=lastOrderNumber+1 
        const newOrderNumberString=String(newOrderNumber).padStart(6,'0');
        orderId="P"+newOrderNumberString 
    }

    
        let total=0;
        let labeledTotal =0
        const products=[]

        for(let i=0; i<orderInfo.products.length; i++){
            const item = await Product.findOne({
                productId:orderInfo.products[i].productId
            })
            if(item==null){
                res.status(404).json({
                    message :"product with productId "+orderInfo.products[i].productId +"not found"
                })
                return
            }

if(item.isAvailble==false){
    res.status(404).json({
        message : "product with productId "+orderInfo.products[i].productId +"not found"
    }); return
}

            products[i]={
                productInfo :{
                    productId:item.productId,
                    name:item.name,
                    altName:item.altName,
                    description:item.description,
                    images:item.images,
                    labeledPrice:item.labeledPrice,
                    price:item.price,
                    quantity:orderInfo.products[i].quantity
                
                },

                quantity:orderInfo.products[i].quantity
            }
        total=total+(item.price * orderInfo.products[i].quantity)
        labeledTotal+=(item.labeledPrice*orderInfo.products[i].quantity)

    }

    

    const order=new Order({
        orderId:orderId,
        email:req.user.email,
        name:orderInfo.name,
        address:orderInfo.address,
        phone : orderInfo.phone,
        products: products,
        total:total,
        labeledTotal: labeledTotal


    })
    try{
        const createOrder=  await order.save()
        res.json({
            message:"Order creted successfully",
            order:createOrder
        })
    }
    catch(err){
        res.status(500).json({
            message:"failed to crete order",
            error:err
        })

    }

    

    
    
    //add current users name if not provided
    //order id generate
    // order create
}
    
