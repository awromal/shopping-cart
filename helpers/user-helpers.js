const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { response } = require('express');
const { resolve } = require('path');
const {ObjectId} =require('mongodb');
const { pipeline } = require('stream');

module.exports ={
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        
        if (!userData.password) {
  return reject(new Error('Password is missing or invalid'));

        }
        userData.password = await bcrypt.hash(userData.password, 10);

        // Insert the user into the database
         db.get().collection(collection.USER_COLLECTIONS).insertOne(userData).then((response)=>{
          resolve(response.insertedId)
        })

        // Return the inserted user data with insertedId
        

      } catch (err) {
        reject(err);
      }
    });
  },

 doLogin: (userData) => {
  return new Promise(async (resolve, reject) => {
    let response={}
    let user = await db.get().collection(collection.USER_COLLECTIONS).findOne({ email: userData.email });

    if (user) {
      bcrypt.compare(userData.password, user.password).then((status) => {
        if (status) {
          console.log("login success");
          resolve({ status: true, user }); // return user data
        } else {
          console.log("login failed - incorrect password");
          resolve({ status: false });
        }
      }).catch((err) => {
        reject(err); // catch any bcrypt error
      });
    } else {
      console.log("login failed - user not found");
      resolve({ status: false });
    }
  });
},

addToCart:(proId,userId)=>{
   let prObj={
     item:new ObjectId(proId),
     quantity:1
   }
  return new Promise(async (resolve, reject) => {
    try {
      const userCart = await db.get().collection(collection.CART_COLLECTIONS).findOne({user: new ObjectId(userId)
      });

      if (userCart){
         let proExist=userCart.product.findIndex(product=>product.item==proId)
         console.log(proExist)
         if(proExist!=-1){
          db.get().collection(collection.CART_COLLECTIONS)
          .updateOne({'product.item':new ObjectId(proId)},
        {
          $inc:{'product.$.quantity':1}
        }
      ).then(()=>{
        resolve()
      })
         }else{
           
                                                                                                
        db.get().collection(collection.CART_COLLECTIONS)
        .updateOne({user:new ObjectId(userId)},
         {
          
           $push:{product:prObj}
          
         }
        ).then((response)=>{
         resolve()
        })
      }
      }else{
          let cartObj = {
          user: new ObjectId(userId),
          product: [prObj]
        };
      
        db.get().collection(collection.CART_COLLECTIONS).insertOne(cartObj).then((response)=>{
          resolve(response);
        }).catch((err) => {
          console.error('Insert failed:', err);
          reject(err);
        });
      }
    } catch (err) {
      console.error('addToCart error:', err);
      reject(err);
    }
  });
},



getCartProducts:(userId)=>{
    return new Promise(async(resolve,reject)=>{
       let cartItems=await db.get().collection(collection.CART_COLLECTIONS).aggregate([
        {
            $match:{user:new ObjectId(userId)}
        },
        {
          $lookup:{
            from:collection.PRODUCT_COLLECTIONS,
             
            let:{prodList:'$product'},
            pipeline:[
              {
                $match:{
                  $expr:{
                   $in:['$_id',"$$prodList"]
                  }
                }
              }
            ],
            as:'cartItems'
          }
        }
      ]).toArray()
      console.log(cartItems[0].product);
        resolve(cartItems[0].cartItems)
      
    })
},

getCartCount: (userId) => {
  return new Promise(async(resolve, reject) => {
    let count=0
    let cart=await db.get().collection(collection.CART_COLLECTIONS).findOne({user:new ObjectId(userId)})
    if(cart){
      count=cart.product.length
    }
    resolve(count)
  })

}};