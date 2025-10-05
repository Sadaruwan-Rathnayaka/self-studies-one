import mongoose from "mongoose";



const userShems=mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },

    firstName : {
        type : String,
        required:true
    },
    
    lastName : {
        type:String,
        required:true,
    },

    password : {
        type :String,
        required:true
    },
    role : {
        type:String,
        required:true,
        default:"customer"
    },
    isBlocked : {
        type :Boolean,
        required:true,
        default: false
    },

    img : {
        type:String,
        required:false,
        default:"https://www.bing.com/images/search?view=detailV2&ccid=MlDlw%2fWQ&id=C751C6CDB2244304A7969A78AB3CCD47F4A468CA&thid=OIP.MlDlw_WQ6Wdtw7nSa9KMcAHaF7&mediaurl=https%3a%2f%2fimages.pexels.com%2fphotos%2f20804701%2fpexels-photo-20804701.jpeg%3fcs%3dsrgb%26dl%3dpexels-agrosales-20804701.jpg%26fm%3djpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.3250e5c3f590e9676dc3b9d26bd28c70%3frik%3dymik9EfNPKt4mg%26pid%3dImgRaw%26r%3d0&exph=4098&expw=5122&q=sample+imges&mode=overlay&FORM=IQFRBA&ck=3CE2DBCBDD9BD49EB667AD33A98D3338&selectedIndex=0&idpp=serp&ajaxhist=0&ajaxserp=0"
    },
})

const User=mongoose.model("users",userShems);

export default User;