import { categories, productsData, usersData } from "../Model/Model.js";
import { isProductInKart } from "../Middlewares/MiddleWare.js";
import jwt from "jsonwebtoken";


export const Login = ( req , res ) => {
    const Data = req.body ;
    jwt.sign( { Data } , process.env.SECRET_KEY , { expiresIn : "1h" } , ( err , token ) => {
        if( err ) return res.status(500).json({ login : false })
        console.log("New token generated");
        return res.status(200).json( {
            login : true ,
            token
        } )
    })
}

export const Signup =  ( req , res ) => {
    console.log("New User try to signup");
    usersData.create( req.body )
    .then((Data) => {
        const token = jwt.sign( {Data} , process.env.SECRET_KEY , { expiresIn : "1h" }  ) 
       
        return res.cookie( "token" , token , {
            maxAge : 10*60*1000
        } ).json({
            signup : true ,
            token 
        })
    }).catch((err) => {
        // console.log(err);
        return res.status(500).json({ signup : "false" , err })
    })

}

export const Orders = ( req , res ) => {
    // console.log( req.cookies );
    return res.status(200).send("This is orders route")
}

export const validateToken = (req , res) =>{
    req.body.login = true
    return res.json( req.body )
} 

export const addFav = async ( req , res ) => {
    //  console.log( req.body );
     const { id  , productId  } = req.body ;

     if( !id ) return res.status(406).json({ err : "Soory... We can not process your request" })
     try {

        const isFav = await usersData.findOne({ _id : id , favorites : { productId : productId }  } )
        if( isFav === null ){
            // console.log( {isFav} );
            const addToFavorites = await usersData.findByIdAndUpdate({ _id : id } , { $push : { favorites : {  productId } }  } , { new : true }  )

            if(addToFavorites){
                let Fav_ids =  addToFavorites.favorites.map(item => { return { id : item.productId }}  )
                productsData.find( {$or : Fav_ids   } )
                .then( ( likedProducts ) => {
                    return res.json({ update : addToFavorites.favorites, likedProducts  , msg : "Added to Fav" })
                } )

            }
        }else{
            return res.json({ update : false   , msg : "Item is already in your Fav" })
        }
        
     } catch (error) {
            return res.status(500).json({ err : error.message , msg : "server error" })
     } 
    
}

export const removeFav = ( req , res ) => {
    const { id , productId  } = req.body ;
    usersData
        .findByIdAndUpdate( { _id : id  , favorites : { productId : productId } } ,
         { $pull : { favorites : { productId } } } ,
         { new : true })
        .then(result => {
            if(result){

                if(result.favorites.length !== 0  ){
                        let Fav_ids =  result.favorites.map(item => { return { id : item.productId }}  )
                         productsData.find( {$or : Fav_ids   } )
                           .then( ( likedProducts ) => {
                            return res.json({ 
                                update : result.favorites,
                                likedProducts  ,
                                msg : "Added to Fav" 
                        })
                    })
                }else{
                        return res.json({ 
                            update : result.favorites,
                            likedProducts : []  ,
                            msg : "Added to Fav" 
                    })
                }

        }else{
            return res.json({ update : false   , msg : "Item is already in your Fav" })
        }
        // return  res.json( { update : result.favorites } )
    }).catch(Err => {
        return res.json({ error : Err.message })
    })
} 

export const getKart = async ( req , res ) => {
    console.log( req.body );
    const { id  , productId } = req.body ;

     !id && res.status(404).json({ err : "unauthorized" })
        
     try {

        const iskart = await usersData.findOne({ _id : id , kart : { productId : productId }  } )
        if( iskart === null ){
            // console.log( {iskart} );
            const user = await usersData.findByIdAndUpdate({ _id : id } , { $push : { kart : { productId } }  } , { new : true }  )

                let cart_ids = user.kart.map(item => { return { id : item.productId }}  )
                productsData.find( {$or : cart_ids   } )
                .then( ( CartProducts ) => { 
                //  req.body.CartProducts = CartProducts; 
                 return res.json( { CartProducts , update : true , msg : "Added to kart"    }  )
            } )
        
            
        }else{
            return res.json({ ...req.body ,  update : false   , msg : "Item is already in your kart" })
        }
        
     } catch (error) {
            return res.status(500).json({ err : error.message , msg : "server error" })
     }
         
   
}

export const updateKart = ( req , res ) => {
   const { id , productId  } = req.body ;
   usersData
       .findByIdAndUpdate( { _id : id , kart : { productId : productId } },
        { $pull : { kart : { productId } } } ,
        { new : true })
       .then(user => {
        if( user.kart.length !== 0 ){
        
            let cart_ids = user.kart.map(item => { return { id : item.productId }}  )
            productsData.find( {$or : cart_ids   } )
            .then( ( CartProducts ) => { 
              
             return  res.json( { CartProducts , update : true, msg : "1 item removed" } ) 
        } )
         }else{
            return  res.json( { CartProducts : [] , update : true, msg : "Some kind of error" } ) 
         }
   }).catch(Err => {
       return res.json({ error : Err.message })
   })
} 


export const getProducts = ( req , res ) => {
    const limit = req.query.limit || 10 ;
    // console.log("Demand " , limit , "Products" );
    productsData.find().limit(limit)
    .then((data) => {
        return res.status(200).json({
            products : data
        })
    })
    .catch((err) => {
        return res.status(500).json( {
            msg : err.message 
        } )
    })
} 



export const getCategories = ( req , res ) => {
    const limit = (req.query.limit || 20 );
    // console.log("Demand " , limit , "categories" );
    categories.find().limit(limit)
    .then((data) => {
        return res.status(200).json(data)
    })
    .catch((err) => {
        return res.status(500).json( {
            msg : err.message 
        } )
    })
}



export const getCategory = ( req , res ) => {
    const category = req.params.category;
    console.log(`searching for ${category}`);
    if(!category) return res.status(406).json({msg : "select the category" })

    productsData.find( { category : category } )
    .then( data => {
        // console.log({ categoryWiseData : data });
        return res.status(200).json( { count : data.length , result : true   , products : data } )
    } )
    .catch(err => {
        return res.status(200).json( { products : [] , result : false , mag : `No result found for ${category}` } )
    })
}


export const singleProduct = (req , res) => {
    const id = req.params.id

    productsData.findOne( { id  } )
    .then((product) => {
        return res.status(200).json(product)
    })
    .catch((err) => {
        return res.status(200).json({ err : err.message , msg : "Product not found" })
    })
}


export const getSearchProducts = ( req , res ) => {
    // const search = "shoes"
    const search = req.query.search ;
    console.log(search);
    if( search.length > 3 && search.length < 10 ){
        // productsData.find( { $or : [
        //         { description : { $regex : `${search}$`, $options : "m" } } , 
        //         { title : { $regex : `${search}$`, $options : "m" } } , 
        //         { category : { $regex : `${search}$`, $options : "m" } } , 
        //         { brand : { $regex : `${search}$`, $options : "m" } }  
            // ]  
            productsData.find( { $text :  search 
        }).then( result => {
            console.log(result);
            if( result.length > 0 ){
             return   res.status(200).json({ count : result.length ,  products : result  })
            }
            console.log(result);
            console.log("0 products found");
            return   res.status(200).json({ products : result })
        }).catch(err => {
            console.log(err);
            return res.status(404).json( { msg : `No result found for ${search}` } )
        })
    }
}