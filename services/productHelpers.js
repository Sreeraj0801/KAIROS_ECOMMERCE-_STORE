const { Collection } = require('mongo');
const { Db, Timestamp } = require('mongodb');
const { resolve, reject } = require('promise');
const collections = require('../config/collections');
var collection = require('../config/collections')
var db = require('../config/connection')
var objectId = require('mongodb').ObjectId
module.exports={
    userLoggedIn:()=>{
        loggedin = req.session.userLoggedIn
    },

    addProduct:(product)=>{
        return new Promise((resolve,reject)=>{
                product.category = objectId(product.category)
                product.brand = objectId(product.brand);
                product.price = parseInt(product.price);
                product.stock = parseInt(product.stock);
                product.date = new Date();
                db.get().collection(collection.PRODUCT).insertOne(product).then((data)=>{   
                resolve(data.insertedId)
                
        })
    })
    }
    ,
    getAllProduct:()=>{
        return new Promise(async(resolve,reject)=>{
            {
                product = await db.get().collection(collections.PRODUCT).aggregate([
                    {
                        $lookup:{
                            from:collection.CATEGORY,
                            localField:'category',
                            foreignField:'_id',
                            as:'categoryDetails'
                        }
                    },
                    {
                        $lookup:{
                            from:collection.BRAND,
                            localField:'brand',
                            foreignField:'_id',
                            as:'brandDetails'
                        }
                    },
                 
                    {
                    
                        $project:{
                            model:1,
                            title:1,
                            category:1,
                            brand:1,
                            price:1,
                            stock:1,
                            discription:1,
                            gender:1,
                            image:1,
                            categoryDetails:{$arrayElemAt:['$categoryDetails',0]},
                            brandDetails:{$arrayElemAt:['$brandDetails',0]},
                           
                        }
                    }
                ]).toArray()
                resolve(product)    
            }
        })
    },
    updateProduct:(productId, productDetails) => {
        result = {
            pid : productId}
         id = objectId(productId)
        return new Promise(async (resolve, reject) => {
                db.get().collection(collections.PRODUCT)
                    .updateOne({ _id: objectId(productId)}, {
                        $set: {
                            price : parseInt(productDetails.price),
                            stock :parseInt(productDetails.stock),
                            brand : objectId(productDetails.brand),
                            category : objectId(productDetails.category),
                            model :  productDetails.model,
                            title :  productDetails.title,
                            discription :  productDetails.discription ,
                            gender:productDetails.gender
                        }
                    })
                    resolve()
                })
    },

//     updateBrand : (brandId,BrandDetails) => {
//         console.log(brandId);
//          return new Promise((resolve,reject)=>{
//          db.get().collection(collections.BRAND)
//          .updateOne({_id:objectId(brandId)},{
//             $set:{
//                 brand:BrandDetails.brand}})
//          resolve()
//        })
//   },
    // getProductDetails: (productId) => {
    //     let pid = objectId(productId)
    //     return new Promise(async(resolve, reject) => {
    //         product = await db.get().collection(collection.PRODUCT).findOne({ _id:pid})
    //         console.log(product)
    //             resolve(product)
            
    //     })
    // },

    getProductDetails:(productId)=>{
        let pid = objectId(productId)
        return new Promise(async(resolve,reject)=>{
            {
                product = await db.get().collection(collections.PRODUCT).aggregate([
                    {$match:{_id:pid}
                    },
                    {
                        $lookup:{
                            from:collection.CATEGORY,
                            localField:'category',
                            foreignField:'_id',
                            as:'categoryDetails'
                        }
                    },
                    {
                        $lookup:{
                            from:collection.BRAND,
                            localField:'brand',
                            foreignField:'_id',
                            as:'brandDetails'
                        }
                    },
                 
                    {
                        $project:{
                            model:1,
                            title:1,
                            category:1,
                            brand:1,
                            price:1,
                            stock:1,
                            discription:1,
                            gender:1,
                            image:1,
                            categoryDetails:{$arrayElemAt:['$categoryDetails',0]},
                            brandDetails:{$arrayElemAt:['$brandDetails',0]},
                           
                        }
                    }
                ]).toArray()
                resolve(product) 
            }
        })
    },

    deleteProduct: (productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT).deleteOne({ _id: objectId(productId)}).then((response) => {
                resolve(response)
            })
        })
    },
    addCategory : (category)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.CATEGORY).insertOne(category).then((response)=>{
                resolve(response.insertedId);
            })
      })
    },
    getAllCategory : ()=>{
        return new Promise((resolve,reject)=>{
            category = db.get().collection(collections.CATEGORY).find({}).toArray()
            console.log(resolve);
            resolve(category)
        })
    },
    getAllCategoryBrands :(() => {
        let response = {};
        return  new Promise(async(resolve,reject)=>{
            response.category = await db.get().collection(collections.CATEGORY).find({}).toArray()
            response.brand = await db.get().collection(collections.BRAND).find({}).toArray()
            console.log(response);
            resolve(response)

        }
        )
    }),
    viewUsers : (()=>{
        return new Promise((resolve,reject)=>{
            userDetails = db.get().collection(collections.USER_COLLECTION).find({}).toArray()
            resolve(userDetails)
        })
    }),
    addBrand : (brand)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.BRAND).insertOne(brand).then((response)=>{
                resolve();
            })

      })
    },
    getAllBrand : ()=>{
        return new Promise((resolve,reject)=>{
            brand = db.get().collection(collections.BRAND).find({}).toArray()
            resolve(brand)
        })
    },
    editBrand : (BrandId)=>{
        return new Promise((resolve,reject)=>{
            BrandDetails = db.get().collection(collections.BRAND).findOne({_id:objectId(BrandId)})
            resolve(BrandDetails)
        })
     }
     ,
     updateBrand : (brandId,BrandDetails) => {
        console.log(brandId);
         return new Promise((resolve,reject)=>{
         db.get().collection(collections.BRAND)
         .updateOne({_id:objectId(brandId)},{
            $set:{
                brand:BrandDetails.brand}})
         resolve()
       })
  },
  deleteBrand : (brandId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.BRAND)
        .deleteOne({_id:objectId(brandId)}).then((response)=>{
            resolve(response)
        })
    })

  },
  editCategory : (categoryId)=>{  
    return new Promise((resolve,reject)=>{
        categoryDetails = db.get().collection(collections.CATEGORY).findOne({_id:objectId(categoryId)})
        resolve(categoryDetails) 
    })
  },
  updateCategory : (categoryId,categoryDetails) => {
     return new Promise((resolve,reject)=>{
     db.get().collection(collections.CATEGORY)
     .updateOne({_id:objectId(categoryId)},{
        $set:{
            category:categoryDetails.category}})
     resolve()
   })
} ,

deleteCategory : (categoryId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.CATEGORY)
        .deleteOne({_id:objectId(categoryId)}).then((response)=>{
            resolve(response)
        })
    })
  },
  getCategoryProducts : (categoryId) => {
    let pid = objectId(categoryId)
    return new Promise(async(resolve,reject)=>{
        {
            product = await db.get().collection(collections.PRODUCT).aggregate([
                {$match:{category:pid}
                },
                {
                    $lookup:{
                        from:collection.CATEGORY,
                        localField:'category',
                        foreignField:'_id',
                        as:'categoryDetails'
                    }
                },
                {
                    $lookup:{
                        from:collection.BRAND,
                        localField:'brand',
                        foreignField:'_id',
                        as:'brandDetails'
                    }
                },
             
                {
                    $project:{
                        model:1,
                        title:1,
                        category:1,
                        brand:1,
                        price:1,
                        stock:1,
                        discription:1,
                        gender:1,
                        categoryDetails:{$arrayElemAt:['$categoryDetails',0]},
                        brandDetails:{$arrayElemAt:['$brandDetails',0]},
                       
                    }
                }
            ]).toArray()
            resolve(product) 
        }
    })
  },
  addBanner : (banner) =>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collections.BANNER).insertOne(banner).then((data)=>{
        resolve(data.insertedId)
    })
  })
  },
 getBanner : () =>{
    return new Promise(async(resolve,reject) =>{
        banner = await db.get().collection(collections.BANNER).find({}).toArray() ;
        resolve(banner)
    })
  },
  deleteBanner : (bannerId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.BANNER)
        .deleteOne({_id:objectId(bannerId)}).then((response)=>{
            resolve(response)
        })
    })
  },
  editBanner : (bannerId) =>{
    return new Promise((resolve,reject)=>{
       brand =  db.get().collection(collections.BANNER).findOne({_id:objectId(bannerId)})
       resolve(brand)
    })
  },
  updateBanner : (bannerId , bannerDetails) =>{
    db.get().collection(collections.BANNER)
    .updateOne({_id:objectId(bannerId)},{
     $set:{bannerName:bannerDetails.bannerName}})
  },
  stockUpdate :(proId , stock) =>{
    stock = stock.stock
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.PRODUCT).updateOne({_id:objectId(proId)},{$set:{stock:stock}})
        resolve()
    })
  },
  getOrders : ()=>{
   return new Promise(async(resolve,reject)=>{
    let orders = await db.get().collection(collections.ORDER).find({}).sort({timestamp:-1}).toArray();
        resolve(orders);
   })
  },
  getDailysSales:()=>{
   return new Promise(async(resolve,reject)=>{
    let details = await db.get().collection(collections.ORDER).aggregate([
        {
            $match:{
                status:{$ne:'canceled'},
                trackOrder:{$ne:'pending'}
            }
        },{
            $group:{
                _id:'$date',
                dailySales:{$sum:'$totalAmount'},
                count:{$sum:1}
            }
        },{
            $sort:{
                _id:-1
            }
        }
    ]).toArray()
    resolve(details)
   })
  },
  getMonthlySales :()=>{
    return new Promise(async(resolve,reject)=>{
        let details = await db.get().collection(collections.ORDER).aggregate([
            {
                $match:{
                    status:{$ne:'canceled'},
                    trackOrder:{$ne:'pending'}
                }
            },{
                $group:{
                    _id:'$month',
                    monthlySales:{$sum:'$totalAmount'},
                    count:{$sum:1}
                }
            },{
                $sort:{
                    _id:-1
                }
            }
        ]).toArray()
        resolve(details)
       })
  },
  getYearlySales :()=>{
    return new Promise(async(resolve,reject)=>{
        let details = await db.get().collection(collections.ORDER).aggregate([
            {
                $match:{
                    status:{$ne:'canceled'},
                    trackOrder:{$ne:'pending'}
                }
            },{
                $group:{
                    _id:'$month',
                    yearlySales:{$sum:'$totalAmount'},
                    count:{$sum:1}
                }
            },{
                $sort:{
                    _id:-1
                }
            }
        ]).toArray()
        resolve(details)
       })
  }
}
