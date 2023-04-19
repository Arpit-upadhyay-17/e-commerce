import express from "express";
const router = express.Router();
import { Login , Signup , Orders , validateToken , addFav , removeFav , getKart , getSearchProducts ,updateKart , getProducts ,getCategories , singleProduct  , getCategory } from "../Controllers/Controller.js"
import { validate , Auth, Check, isProductInFav, isProductInKart } from "../Middlewares/MiddleWare.js";


 router.post("/login"  , Check , Login )
 router.post("/signup" , validate , Signup )
 router.get("/kart" , Orders )
 router.get("/auth" , [Auth , isProductInFav , isProductInKart  ] , validateToken )

// Apis for Add and remove favorite products

 router.post("/addFav" , addFav )
 router.post("/removeFav" , removeFav )

 // Apis for Kart 

 router.post("/getKart" , getKart )
 router.post("/updateKart" , updateKart )

 // get Products Data

 router.get("/products" , getProducts )
 router.get("/products/:id" , singleProduct )
 router.get('/categories' , getCategories )
 router.get('/categories/:category' , getCategory )

 // search route

 router.get( "/search" , getSearchProducts )

 export default router;