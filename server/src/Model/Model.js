import mongoose from "mongoose";
const { Schema }  = mongoose;
// const { Types } = Schema

const userSchema = new Schema({
    name : {
        type : String,
        require : [ true , "Name is required" ]
    },
    email : {
        type : String , 
        unique : true,
        // max : [ 20 , ["length should be below to 20"] ] ,
        require : [ true , "email is required" ],
    },
    password : {
        type : String , 
        max : [ 8 , ["length should be below to 8"] ] ,
        require : [ true , "password is required" ]
    },
    address : [ {
            
            zone : String ,
            city : String,
            state : String ,
            pinCode : Number ,
            F_place : String
            } 
        ]
    ,
    date : {
        type : Date ,
        default : Date.now()
    },
    favorites : {
        type : Array,
        default : null
    },

    kart : {
        type : Array,
        default : null
    }
    
} , {
    collection : "usersData"
} )

const productSchema = new Schema({

    id : {  type : Number },
    title: { type : String  },
    description:{ type : String , max : 250 },
    price: {  type : Number },
    discountPercentage: {  type : Number },
    rating: {  type : Number },
    stock: {  type : Number },
    brand: { type : String },
    category: { type : String },
    thumbnail: { type : String } ,
    images: { type : Array }
         
    
} , {
    collection : "Products"
} )

const categorySchema = new Schema({
    category : {
        type : String,
        unique : true
    }
} , {
    collection : "Categories"
} )
    


export const usersData = mongoose.model("usersData" , userSchema );
export const productsData = mongoose.model("productsData" , productSchema )
export const categories = mongoose.model("categorySchema" , categorySchema )


