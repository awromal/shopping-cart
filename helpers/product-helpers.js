const { resolve } = require('path');
const db = require('../config/connection');
const collection = require('../config/collections');
const { rejects } = require('assert');
const {ObjectId} =require('mongodb');
const { response } = require('../app');

module.exports = {
    addProduct: (product, callback) => {
        console.log("Received product:", product);

        db.get()
        .collection('product')
        .insertOne(product)
        .then((data) => {
           
            //console.log("Insert result:", data);
             console.log("Inserted ID:", data.insertedId);
             callback(data.insertedId)
        })
        .catch((err) => {
            console.error("Insert error:", err);
            callback(false); // Notify failure
        });
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTIONS).find().toArray()
            resolve(products)
        })
    },

    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
           db.get().collection(collection.PRODUCT_COLLECTIONS).deleteOne({ _id: new ObjectId(proId) }).then((response) => {
              console.log("Deleted:", response);
              resolve(response)
              })
           .catch((err) => {
            console.error("Error:", err);
          });
        })
    },

    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS).findOne({_id: new ObjectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateProduct:(proId,proDetails)=>{

           return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIONS)
            .updateOne({_id:new ObjectId(proId)},{
                $set:{
                    name:proDetails.name,
                    Description:proDetails.Description,
                    price:proDetails.price,
                    category:proDetails.category
                }
            }).then((response)=>{
                resolve()
            })
          })
    }
}
