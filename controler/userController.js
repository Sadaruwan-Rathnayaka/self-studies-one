import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function creteUser(req,res){

    if(req.body.role=="admin"){
        if(req.body.user!==null){
            if(req.user.role !== "admin"){
                res.status(403).json({
                    message:"you are not authrorized to certe an admin accounts"
                })
                return
            }

        }else{
            res.status(403).json({
                message:"first crete admin accounr and login"
            })
            return
        }
    }

const hashedPassword=bcrypt.hashSync(req.body.password,10)

    const user=new User({
        email : req.body.email,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : hashedPassword,
        role : req.body.role
        
    
    })

    user.save().then(
        ()=>{
            res.json ({
                message:'user crete succesfully'
            })
        }
    ).catch(()=>{
        res.json({
            message:"failed"
        })
    })
    
}
export function loginUser(req,res){
    const email=req.body.email
    const password=req.body.password

    User.findOne({email:email}).then(
        (user)=>{
            if(user==null){
                res.status(404).json({
                    message:"user not found"
                })
            }else {
                const ispasswordCorrect = bcrypt.compareSync(password,user.password)
                if (ispasswordCorrect){
const token=jwt.sign({
    email:user.email,
    firstName:user.firstName,
    lastName:user.lastName,
    role:user.role,
    img:user.img
},
"chamo"
)

                    res.json({
                        message:"login sucessfully",
                        token:token
                    })
                } else {
                    res.status(401).json({
                        message:"invalid passwod"
                    })
                }
            }
        }
    )
    
}

export function isAdmin(req){
    if(req.user==null){
    
        return false
    }
    
    if(req.user.role != "admin"){
    
        return false
    }
    return true
}