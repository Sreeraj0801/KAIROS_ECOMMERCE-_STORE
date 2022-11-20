const { log } = require('debug/src/browser');
const { response } = require('express');
const async = require('hbs/lib/async');
const { Collection } = require('mongo');
const { Db, Timestamp } = require('mongodb');
const { resolve, reject } = require('promise');
const { CustomerProfilesContext } = require('twilio/lib/rest/trusthub/v1/customerProfiles');
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
                            offerPercentage:1,
                            oldPrice:1,
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
    getCategory:(id)=>{
        return new Promise((resolve,reject)=>{
            category =db.get().collection(collections.CATEGORY).findOne({_id:objectId(id)})
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
     updateBrand : (details) => {
        console.log(details);
         return new Promise((resolve,reject)=>{
         db.get().collection(collections.BRAND)
         .updateOne({_id:objectId(details.id)},{
            $set:{
                brand:details.brand,
                image:details.image}})
         resolve()
       })
  },
  getBrand:(brandId)=>{
    return new Promise(async(resolve,reject)=>{
        brand =await db.get().collection(collections.BRAND).findOne({_id:objectId(brandId)})
        resolve(brand)
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
  updateCategory : (details) => {
     return new Promise((resolve,reject)=>{
     db.get().collection(collections.CATEGORY)
     .updateOne({_id:objectId(details.id)},{
        $set:{
            category:details.category,
            image:details.image}})
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
    // let orders = await db.get().collection(collections.ORDER).find({}).sort({timestamp:-1}).toArray();
    let orders = await db.get().collection(collections.ORDER).aggregate([
        {
            $unwind:'$products',
        }
    ]).toArray()
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
    ]).toArray().then((dailySales)=>{
        let totalAmount = 0;
        dailySales.forEach(element => {
            totalAmount =+ element.dailySales;
        })
        dailySales.totalAmount = totalAmount
        resolve(dailySales)
    })
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
        ]).toArray().then((monthlySales)=>{
            let totalAmount = 0;
            monthlySales.forEach(element => {
                totalAmount =+ element.monthlySales;
            })
            monthlySales.totalAmount = totalAmount
            resolve(monthlySales)
        })
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
                    _id:'$year',
                    yearlySales:{$sum:'$totalAmount'},
                    count:{$sum:1}
                }
            },{
                $sort:{
                    _id:-1
                }
            }
        ]).toArray().then((yearlySales)=>{
            let totalAmount = 0;
            yearlySales.forEach(element => {
                totalAmount =+ element.yearlySales;
            })
            yearlySales.totalAmount = totalAmount
            resolve(yearlySales)
        })
       })
  },
  addproductOffer : (details)=>{
    let err
    inputPrice = parseInt(details.offerPercentage)
    details.id = objectId(details.id)
    return new Promise(async(resolve,reject)=>{
       products = await db.get().collection(collections.PRODUCT).findOne({_id:objectId(details.id)})
       if(products.offerPercentage)
       {
        oldPrice = products.oldPrice;
        priceCal = (oldPrice * inputPrice)/100;
        offerPrice = oldPrice - priceCal ;
        offerPrice = Math.ceil(offerPrice);

        await db.get().collection(collections.PRODUCT).updateMany({_id:details.id},{$set:{
            oldPrice:oldPrice,
            price:offerPrice,
            offerPercentage : inputPrice
           }})
           resolve({status:true})
       }else{
        oldPrice = products.price;
       priceCal = (oldPrice * inputPrice)/100;
       offerPrice = oldPrice - priceCal ;
       offerPrice = Math.ceil(offerPrice);

       await db.get().collection(collections.PRODUCT).updateMany({_id:details.id},{$set:{
        oldPrice:oldPrice,
        price:offerPrice,
        offerPercentage : inputPrice
       }})
       resolve({status:true})
       reject(err)
       }
       
      })
  },
  
  removeProductOffer:(id)=>{
    return new Promise(async(resolve,reject)=>{
        product = await db.get().collection(collections.PRODUCT).findOne({_id:objectId(id)});
        oldPrice = product.oldPrice;
        if(product.oldPrice){
            await db.get().collection(collections.PRODUCT).updateOne({_id:objectId(id)},{$set:{price:oldPrice}})
            await db.get().collection(collections.PRODUCT).updateOne({_id:objectId(id)},{$unset:{
                offerPercentage : 1,
                oldPrice :1
                }})
                resolve({status:true})
        }    
    })
  },
  addCoupon :(details)=>{
    return new Promise(async(resolve,reject)=>{
        let date = new Date();
        let Day = date.getDate();
        let Month = date.getMonth() + 1;
        let Year = date.getFullYear();
        let finaldate = `${Year}-${Month}-${Day}`
        details.createdDate = finaldate
        details.offerPercentage = parseInt(details.offerPercentage);
        details.status = "valid"
        let coupon = await db.get().collection(collections.COUPON).findOne({'details.offertext':details.offertext})
        console.log(coupon);
        console.log(details.offertext);
        if(coupon)
        {
            if(details.createdDate > details.expiryDate ){
                resolve({date:true})
            }
            else{
                resolve({coupon:true})
            }
            
        }
        else{
            if(details.createdDate > details.expiryDate ){
                resolve({date:true})
            }
            else{
               
                await db.get().collection(collections.COUPON).insertOne({details}).then(()=>{
                    resolve({status:true})
                })
            }
        }
    })
  },
  getAllCoupons :()=>{
    return new Promise(async(resolve,reject)=>{
       coupons =  await db.get().collection(collections.COUPON).find({}).toArray()
            resolve(coupons)

    })
  },
  removeCoupon:(id)=>{
    return new Promise(async(resolve,reject)=>{
        await db.get().collection(collections.COUPON).deleteOne({_id:objectId(id)}).then(()=>{
            resolve({status:true})
        })
    })
  },
  checkCoupon :()=>{
    return new Promise((resolve,reject)=>{
        let date = new Date();
        let Day = date.getDate();
        let Month = date.getMonth() + 1;
        let Year = date.getFullYear();
        let finaldate = `${Year}-${Month}-${Day}`
        db.get().collection(collections.COUPON).update({'details.expiryDate':finaldate},{$set:{
            'details.status' :'expired'
        }})
    })
  },
  findCoupon:(detail,user)=>{
    return new Promise(async(resolve,reject)=>{
    coupon = await db.get().collection(collections.COUPON).findOne({'details.offertext':detail.coupon})
    user = await db.get().collection(collections.COUPON).findOne({users:user,'details.offertext':detail.coupon})
    if(coupon){
        if(coupon.details.status == 'expired'){
            resolve({expire:true})
        }
        else if(user)
        {
            resolve({user:true})
        }
        else{
            couponName = coupon.details.offertext
            percentage = coupon.details.offerPercentage
            couponDetails ={
                coupon:couponName,
                offerPercentage:percentage,
                couponStatus:true
            }
            resolve(couponDetails)
        }
    }
    else{
        resolve({couponNoExist:true})
    }
    })
  },
  gerWalletBalance:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        let walletBalance = await db.get().collection(collections.WALLET).findOne({userId:objectId(userId)})
        resolve(walletBalance.Total)
    })
  },
  getCustomers:()=>{
    return new Promise(async(resolve,reject)=>{
       customer =  await db.get().collection(collections.ORDER).aggregate([
           {
            $group:{_id:"$userId"}
           }
        ]).toArray()
        customer = customer.length;
        resolve(customer)        
    })
  },
  topSellingProducts :()=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.ORDER).aggregate([
            {
                $unwind:'$products'
            },
            {
                $group:{_id:"$products.item","count":{$sum:"$products.quantity"}}
            },{
                $sort:{"count":-1}
            },
            {
                $limit:10
            },
            {
                $lookup:{
                    from:collection.PRODUCT,
                    localField:"_id",
                    foreignField:"_id",
                    as:"productdetails"
                }
            },
            {
                $project:{
                    product:{ $arrayElemAt: ['$productdetails', 0] }
                }
            }
        ]).toArray().then((response)=>{
            resolve(response)
        })
    })
  }
}
