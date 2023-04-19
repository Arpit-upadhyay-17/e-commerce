import bcrypt  from "bcrypt";
import  jwt from "jsonwebtoken";
import {usersData , productsData } from "../Model/Model.js";

export const validate = (req , res , next) => {
    const { name , email , password , zone , city , state , pinCode , F_place  }  = req.body;
    if( name !== "" && email !== "" && password !== ""  ){
        bcrypt.hash( password , 10 ).then( (hash) => {
            req.body = {
                name ,
                email,
                password : hash,
                address : { zone , city , state , pinCode , F_place  } ,
                favorites : [],
                kart : []
            }
            return next();
        }).catch((Err) => {
            return res.status(500).json({
              msg : Err
            })
        })
    }else{
        return res.status(406).json({
            msg : "Fill the neccessary fields"
        })
    }
} 



// const isProductInFav = (favorites) => {
//     console.log("checking isProductInFav");

//     // if(result.favorites.length !== 0 ){
//     if( favorites.length !== 0 ){
//         console.log("fav mein data hai");
//         let Fav_ids =   favorites.map(item => { return { id : item.productId }}  )
//         productsData.find( {$or : Fav_ids   } )
//         .then( ( likedProducts ) => {
//             console.log( {likedProducts} );
//     //    return req.body.likedProducts = likedProducts  
//             console.log( "middleware" );
//             console.log(req.body);
//        return  likedProducts
//     } ).catch(err => {
//         console.log(err)
//     })
//     }else{
//         console.log("Fav 0 hai................");
//         // return req.body.likedProducts = []  
//         return []  ;
//     }
// }





export const Auth = async ( req , res , next ) => {
   
    const { authorization  } = req.headers

    if(! authorization  ){
      return res.status(406).json({
            msg : "un Authorized access"
        })
    }

    jwt.verify( authorization  , process.env.SECRET_KEY ,  (err , data) => {

        if ( err ) return res.json({ msg : err.message , login : false , CartProducts : [] , likedProducts : []  })

        if ( data ) {
            usersData.findOne( { email : data.Data.email })
            .then((result) => {
                req.body.Data = result;
                req.body.msg = "login successfully" ;
                return next();
            })
            .catch(err => {
                return res.status(406).json({
                    login : "Login failed..."
                });
            })
        }
        
    })
}

export const isProductInFav = ( req , res , next ) => {
    console.log("checking isProductInFav");
    if( req.body.Data.favorites.length !== 0 ){
        // console.log("fav mein data hai");
        let Fav_ids =   req.body.Data.favorites.map(item => { return { id : item.productId }}  )
        productsData.find( {$or : Fav_ids   } )
        .then( ( likedProducts ) => {
            // console.log( {likedProducts} );
       req.body.likedProducts = likedProducts  
       return next();
    } ).catch(err => {
        req.body.likedProducts = []
        console.log(err)
        next();
    })
    }else{
        console.log("Fav 0 hai................");
         req.body.likedProducts = []  
        next() ;
    }
}
 
export const isProductInKart = ( req , res , next ) => {
   
    if( req.body.Data.kart.length !== 0 ){
        console.log("cart mein data hai");

        let cart_ids = req.body.Data.kart.map(item => { return { id : item.productId }}  )
        productsData.find( {$or : cart_ids   } )
        .then( ( CartProducts ) => { 
         req.body.CartProducts = CartProducts; 
         next();
    } )
     }else{
        console.log("kart mein 0 hai................"); 
         req.body.CartProducts = []; 
         next();
     }
}


export const Check = async ( req , res , next ) => {
    const { email , password } = req.body ;
    if ( email === "" && password === "" ){
        return res.json({ msg : "fill the neccessary fields" })
    }

    // console.log(password);

    try {
            const response = await usersData.findOne({ email : email })
            if( response !== null ){

                // console.log( { a : password , B : response.password } );
                bcrypt.compare( password , response.password )
                .then( result => {
                        req.body =  response 
                        return next();
                })
                .catch((err) => {
                    return res.status(404).json({ login : false , msg : "credentials not match" })
                })

            }else{
                return res.status(404).json({ login : false , msg : "credentials-not-match"  })
            }

        
    } catch (error) {
        console.log(" erereror " , error.message );
        return res.status(406).json({ login : false , msg : "credentials not---match" })
    }
}



