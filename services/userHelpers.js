var db = require("../config/connection")
var collection = require("../config/collections")
const bcrypt = require('bcrypt')
const collections = require("../config/collections")
const { resolve, reject } = require("promise")
const { response } = require("express")
var objectId = require('mongodb').ObjectId
const voucher_codes = require('voucher-code-generator');

//requirong env files
const dotenv = require('dotenv').config();
//<---------------requiring Razorpay----------------->
const Razorpay = require('razorpay');       
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KET_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
//<---------------requiring Paypal ----------------->
const paypal = require('paypal-rest-sdk');
const { log } = require("console")
const { request } = require("http")
const { getProductDetails } = require("./productHelpers")
const { Timestamp } = require("mongodb")
const { stat } = require("fs")
const async = require("hbs/lib/async")
const { lookup } = require("dns")
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id':process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});




//<-----------Export modules as Helpers-------------->
module.exports = {

    //<-----------user SignUP user---------->
    addUser: (users) => {
        return new Promise(async (resolve, reject) => {
            let response = {
            }
            let count = await db.get().collection(collection.USER_COLLECTION).count({ Remail: users.Remail });
            let mobileCount = await db.get().collection(collection.USER_COLLECTION).count({Rmobile: users.Rmobile });
            if (count != 0 || mobileCount !=0) {
                response.status = false;
                response.userExist = true;
                resolve(response)
            } else {
               let refferal =  voucher_codes.generate({
                    prefix: "ref-",
                    length:10,
                    postfix: "-"+users.Rname
                });
                users.status = true
                users.refferal = refferal[0] ;
                users.Rpassword = await bcrypt.hash(users.Rpassword, 10)
                db.get().collection('users').insertOne(users)
                    .then((data) => {
                        response.status = true;
                        response.message = "";
                        response.id = data.insertedId;
                        resolve(response) 
                    })
            }
        })
    },

    // Login 
    doLogin: (users) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let userdata = await db.get().collection(collection.USER_COLLECTION).findOne({ Remail: users.Lemail });
            if (userdata) {
                bcrypt.compare(users.Lpassword, userdata.Rpassword).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = userdata;
                        response.loginStatus = true;
                        resolve(response);
                    }
                    else {
                        response.loginStatus = false;
                        console.log('login failed');
                        response.user = false;
                        resolve(response)
                    }
                })
            } else {
                response.loginStatus = false;
                response.user = false;
                console.log('login failed Invalid');
                resolve(response)
            }
        })
    },
    userBlock: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION)
                .updateOne({ _id: objectId(userId) }, {
                    $set: {
                        status: false
                    }
                }).then((response) => {
                    resolve({ status: false })
                })
        })
    },
    userUnblock: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION)
                .updateOne({ _id: objectId(userId) }, {
                    $set: {
                        status: true
                    }
                }).then((response) => {
                    resolve({ stats: true })
                })
        })
    },
    checkPhoneNumber: (mobileNumber) => {
        let statusmessage = {

        }

        return new Promise(async (resolve) => {
            userDetails = await db.get().collection(collections.USER_COLLECTION).findOne({ Rmobile: mobileNumber.phonenumber })
            if (userDetails) {
                statusmessage.user = userDetails
                statusmessage.status = true
                resolve(statusmessage)
            }
            else {
                statusmessage.message = "Account Not Registered"
                statusmessage.status = false
                resolve(statusmessage)
            }

        })
    },
    userDetails: ((mobileNumber) => {
        return new Promise(async (resolve, reject) => {
            User = await db.get().collection(collections.USER_COLLECTION).findOne({ Rmobile: mobileNumber })
            resolve(User)
        })
    }),

    addToCart: async (prodId, userId) => {
        let Cproduct = await db.get().collection(collections.PRODUCT).findOne({ _id: objectId(prodId) })
        let productObj = {
            item: objectId(prodId),
            price: parseInt(Cproduct.price),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collections.CART).findOne({ user: objectId(userId) })
            if (userCart) {
                let prodExist = userCart.products.findIndex(products => products.item == prodId);
                if (prodExist != -1) {
                    db.get().collection(collections.CART)
                        .updateOne({ user: objectId(userId), 'products.item': objectId(prodId) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then(() => {
                            resolve()
                        })
                } else {
                    db.get().collection(collections.CART)
                        .updateOne({ user: objectId(userId) },
                            {
                                $push: { products: productObj }
                            })
                        .then((response) => {
                            resolve()
                        })
                }
            }
            else {
                let cartObj = {
                    user: objectId(userId),
                    products: [productObj]
                }
                db.get().collection(collections.CART).insertOne(cartObj).then((response) => {
                    resolve();
                })
            }
        })
    },

    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collections.CART).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray()
            resolve(cartItems)
        })
    },

    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collections.CART).findOne({ user: objectId(userId) })
            if (cart) {
                count = cart.products.length
            }
            resolve(count)
        })
    },

    changeProductQuantity: (details) => {
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        return new Promise(async (resolve, reject) => {
            if (details.count == -1 && details.quantity == 1) {
                db.get().collection(collections.CART)
                    .updateOne({ _id: objectId(details.cart) },
                        {
                            $pull: { products: { item: objectId(details.product) } }
                        }
                    ).then((response) => {
                        resolve({ removeProduct: true })
                    })
            }
            else {
                db.get().collection(collections.CART)
                    .updateOne({ _id: objectId(details.cart), 'products.item': objectId(details.product) },
                        {
                            $inc: { 'products.$.quantity': details.count }
                        }
                    ).then((response) => {
                        resolve({ status: true })
                    })
            }
        })
    },
    removeProduct: (details) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collections.CART)
                .updateOne({ _id: objectId(details.cart) },
                    {
                        $pull: { products: { item: objectId(details.product) } }
                    }
                ).then((response) => {

                    resolve({ removeProduct: true })
                })
        })
    },
    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collections.CART).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$quantity', '$product.price'] } }
                    }
                }
            ]).toArray()
            resolve(total)
        })
    },
    getCartProductList:(userId) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collections.CART).findOne({ user: objectId(userId) })
            resolve(cart.products);
        })
    },
    placeOrder: (order, products, total, paymentMethod,couponDetails) => {
        products.forEach(element => {
            element.totalPrice = element.price*element.quantity
        });    
        products.forEach(element => {
            element.trackOrder = "Preparing for dispatch"
        });
        if(couponDetails)
        {
            products.forEach(element => {
                element.priceOffer = Math.ceil( element.totalPrice -  (element.totalPrice * parseInt(couponDetails.offerPercentage) /100))
            });
        }
        return new Promise((resolve, reject) => {
            let date = new Date();
            let Day = date.getDate();
            let Month = date.getMonth();
            let Year = date.getFullYear();
            let finaldate = `${Day}/${Month}/${Year}` 
            let status = paymentMethod == 'COD' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: {
                    mobile: order.phone,
                    address: {
                        Lname: order.Lname,
                        Rname: order.Rname,
                        house: order.houseName,
                        street: order.apartmentName,
                        city: order.city,
                        state: order.state
                    },
                    pincode: order.zip
                },
                userId: objectId(order.userId),
                paymentMethod: paymentMethod,
                products: products,
                totalAmount: total,
                status: status,
                trackOrder: "Orderd",
                name: order.Fname,
                date: finaldate,
                month:Month,
                year:Year,
                couponDetails:couponDetails,
                timestamp: new Date()
            }
            db.get().collection(collections.ORDER).insertOne(orderObj)
                .then((response) => {   
                     db.get().collection(collections.CART).deleteOne({ user: objectId(order.userId)});   
                    resolve(response.insertedId);
                }).catch((err)=>{
                    console.log(err);
                })
        })
    },
    getUserOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collections.ORDER)
                .find({ userId: objectId(userId)}).sort({timestamp:-1}).toArray();
            resolve(orders)
        })
    },
    getOrderProducts: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collections.ORDER).aggregate([
                {
                    $match: { _id: objectId(orderId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                        totalPrice:'$products.totalPrice',
                        trackOrder:'$products.trackOrder'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        totalPrice:1,
                        trackOrder:1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray()
            resolve(products)

        })
    },
    updateTrackOrder: (orderId,prodId, status,message,refundAmount,userId) => {
        return new Promise(async(resolve, reject) => {
        db.get().collection(collections.ORDER).updateOne({ _id: objectId(orderId),'products.item':objectId(prodId)}, { $set: {'products.$.trackOrder': status }})
       if(status == 'canceled')
       {
        products = await db.get().collection(collections.ORDER).aggregate([
            {
                $match:{_id:objectId(orderId)}
            },
            { 
                $unwind:'$products',
            },
            {
                $match:{'products.item':objectId(prodId)}
            }
        ]).toArray()
        userId = products[0].userId
        price = products[0].products.price;
        paymentMethod = products[0].paymentMethod
        if(paymentMethod != 'COD'){
            if(products[0].couponDetails)
            {
                total = products[0].products.totalPrice;
                offer = products[0].couponDetails.offerPercentage;
                cal = parseInt((total *offer)/100)
                price = total - cal;
                console.log(offer);
                refferalData = {
                    Amount : parseInt(price),
                    Date:new Date().toDateString(),
                    Timestamp:new Date(),
                    status:"credited",
                    message:"Order Cancell Refund"
                }

                db.get().collection(collections.WALLET).updateOne({userId:userId},{
                    $inc:{
                        Total:price
                    },
                    $push:{
                        Transaction :refferalData
                    }
                })
                detail={
                    refund:true,
                    amount:price
                }
                resolve(detail)
            }
            else{
                refferalData = {
                    Amount : parseInt(price),
                    Date:new Date().toDateString(),
                    Timestamp:new Date(),
                    status:"credited",
                    message:"Order Cancell Refund"
                }
                db.get().collection(collections.WALLET).updateOne({userId:userId},{
                    $inc:{
                        Total:price
                    },
                    $push:{
                        Transaction :refferalData
                    }
                })
                detail={
                    refund:true,
                    amount:price
                }
                resolve(detail)
            }
        }
        else{
            resolve({COD:true})
        }
        
       }
       else if(status == "return requested" && message){
        db.get().collection(collections.ORDER).updateOne({ _id: objectId(orderId),'products.item':objectId(prodId)}, { $set: {'products.$.message': message}})
        resolve({retunrequested:true})
       }
       else if(status == "return approved" && refundAmount)
       {
        console.log("hai bro how are you");
        refundAmount = parseInt(refundAmount)
        userId = objectId(userId)
        db.get().collection(collections.ORDER).updateOne({ _id: objectId(orderId),'products.item':objectId(prodId)}, { $set: {'products.$.message': message}}).then(()=>{
            refundData = {
                Amount :refundAmount ,
                Date:new Date().toDateString(),
                Timestamp:new Date(),
                status:"credited",
                message:"Product Return Refund Amount"
            }
            db.get().collection(collections.WALLET).updateOne({userId:userId},{
                $inc:{
                    Total:refundAmount
                },
                $push:{
                    Transaction :refundData
                }
            })
    
        })
        resolve({retunrequested:true})
       }
       
       else{
        resolve({ status: true })
       }
        
        })
    },

    addAddress: (details) => {
        details.userId = objectId(details.userId)
        db.get().collection(collections.ADDRESS).insert(details)
    },

    getAddress: (userId) => {
        return new Promise(async (resolve, reject) => {
            let response = await db.get().collection(collections.ADDRESS).find({ userId: objectId(userId) }).toArray()
            resolve(response)
        })
    },
    getSingleAddress: (addId) => {
        return new Promise(async (resolve, reject) => {
            addId = objectId(addId)
            address = await db.get().collection(collections.ADDRESS).findOne({ _id: addId })
            console.log(address);
            resolve(address)
        })
    },
    getUserDetails: (userId) => {
        console.log(userId);
        return new Promise((resolve, reject) => {
            details = db.get().collection(collections.USER_COLLECTION).findOne({ _id: objectId(userId) })
            resolve(details)
        })
    },
    changePassword: (details, userId) => {
        return new Promise(async (resolve, reject) => {
            let userdata = await db.get().collection(collections.USER_COLLECTION).findOne({ _id: objectId(userId) })
            let checkPass = await bcrypt.compare(details.CPass, userdata.Rpassword)
            if (checkPass) {
                let pass = await bcrypt.hash(details.Npass, 10)
                db.get().collection(collections.USER_COLLECTION)
                    .updateOne({ _id: objectId(userId) }, { $set: { Rpassword: pass } })
                    .then(() => {
                        response.status = true
                        resolve({ status: true })
                    })
            }
            else {
                resolve({ status: false })
            }

        })
    },
    updateUserDetails: (details) => {
        details.id = objectId(details.id)
        return new Promise(async (resolve, reject) => {
            email = await db.get().collection(collections.USER_COLLECTION).count({ $and: [{ Remail: details.newEmail }, { _id: { $ne: details.id } }] })
            phone = await db.get().collection(collections.USER_COLLECTION).count({ $and: [{ Rmobile: details.newPhone }, { _id: { $ne: details.id } }] })
            if (email != 0 || phone != 0) {
                resolve({ status: false })
            }
            else {
                db.get().collection(collections.USER_COLLECTION).updateOne({ _id: details.id }, {
                    $set: {
                        Rname: details.newName,
                        Remail: details.newEmail,
                        Rmobile: details.newPhone
                    }
                })
                resolve({ status: true })
            }
        })
    },
    getSingleAddress: (addId) => {
        return new Promise(async (resolve, reject) => {
            address = await db.get().collection(collections.ADDRESS).findOne({ _id: objectId(addId) })
            resolve(address)
        })
    },
    
    editAddress: (details) => {
        details.Id = objectId(details.Id)
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ADDRESS).updateOne({ _id: details.Id }, {
                $set: {
                    Fname: details.Fname,
                    Lname: details.Lname,
                    country: details.country,
                    houseName: details.houseName,
                    appartmentName: details.appartmentName,
                    city: details.city,
                    state: details.state,
                    zip: details.zip,
                    phone: details.phone,
                    email: details.email
                }
            })
            resolve({ status: true })
        })
    },
    deleteAddress: (addId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collections.ADDRESS).deleteOne({ _id: objectId(addId) })
            resolve({ status: true })
        })
    },
    generateRazorpay: (orderId, total) => { 
        return new Promise((resolve, reject) => {
            var options = {
                amount: parseInt(total)*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderId.toString()
            };
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                }
                else {
                    resolve(order)
                }
            });
        })
    },
    verifyPayment: (details) => {
        return new Promise ((resolve,reject)=>{
                const crypto = require('crypto');
                let hmac = crypto.createHmac('sha256',process.env.CRYPTO_SECRET_KEY);
                hmac.update(details['payment[razorpay_order_id]'] +'|'+ details['payment[razorpay_payment_id]']);
                hmac = hmac.digest('hex');
                if(hmac == details['payment[razorpay_signature]'])
                {
                    resolve({status:"hello"})
                }else{
                    reject({status:"hai failure"})
                }
            
        })
    },
    changePaymentStatus : (orderId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.ORDER)
            .updateOne({_id:objectId(orderId)},
            {
                $set:{     
                status:'placed'
                }
            }
            ).then(()=>{
                resolve()
            })
        })
    },
    generatePaypal :(orderId,total)=>{
        return new Promise((resolve,reject)=>{
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3000/success",
                    "cancel_url": "http://localhost:3000/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "Red Sox Hat",
                            "sku": "001",
                            "price": "25.00",
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": "25.00"
                    },
                    "description": "Hat for the best team ever"
                }]
            };
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for(let i = 0;i < payment.links.length;i++){
                      if(payment.links[i].rel === 'approval_url'){
                        resolve(payment.links[i].href);
                      }
                    }
                }
              });

        })
    },
    changeForgetPword: (mobile,details)=>{
        return new Promise(async(resolve,reject)=>{
            if(details.Cpass === details.Npass && mobile)
            {
                let pass = await bcrypt.hash(details.Npass, 10)
                db.get().collection(collections.USER_COLLECTION).updateOne({
                    Rmobile:mobile},{
                        $set:{
                            Rpassword:pass 
                        }
                    }).then(()=>{
                        resolve({passwordUpdated:true})
                    })
            }
            else{
               resolve({passwordMatch:true})
            }
        })

    },
    findMobile:(mobileNo)=>{
        console.log(mobileNo);
       return new Promise(async(resolve,reject)=>{
        let mobile = await db.get().collection(collections.USER_COLLECTION).findOne({Rmobile:mobileNo});
        if(mobile)
        {
            details = {
                status:true,
                mobile:true
            }
            resolve(details)
        }
        else{
            resolve({mobileNotExist:true})
        }
       })
    },

    // returnOrder:(details)=>{
    //     let id = objectId(details.id)
    //     return new Promise(async(resolve,reject)=>{
    //        let order =  await db.get().collection(collection.ORDER).find({_id:id}).toArray();

    //     })

    // },
    addWallet : (userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.WALLET).insertOne({
                userId:userId,
                balance:parseInt(0)
            })
            
        })
    },
    productSearch :(detail) =>{
        return new Promise((resolve,reject)=>{
        let value = "";
        value = detail.search;
        let getProductDetails = db.get().collection(collections.PRODUCT).find({$or:[{
            title : {$regex:'.*'+value+'.*',$options:'i'}
        }]}).toArray()
        resolve(getProductDetails)
        })
        
    },
    addToWishlist: async (prodId, userId) => {
        let product = await db.get().collection(collections.PRODUCT).findOne({ _id: objectId(prodId) })
        let productObj = {
            item: objectId(prodId),
            price: parseInt(product.price)
        }
        return new Promise(async (resolve, reject) => {
            let userWishlist = await db.get().collection(collections.WISHLIST).findOne({ user: objectId(userId) })
            if (userWishlist) {
                let prodExist = userWishlist.products.findIndex(products => products.item == prodId);
                if (prodExist != -1) {
                    resolve({product:true})
                } else {
                    
                    db.get().collection(collections.WISHLIST)
                        .updateOne({ user: objectId(userId) },
                            {
                                $push: { products: productObj }
                            })
                        .then((response) => {
                            resolve({status:true})
                        })
                }
            }
            else {
                let wishlistObj = {
                    user: objectId(userId),
                    products: [productObj]
                }
                db.get().collection(collections.WISHLIST).insertOne(wishlistObj).then((response) => {
                    resolve({status:true});
                })
            }
        })
    },

    getWishlistProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let wishlistItems = await db.get().collection(collections.WISHLIST).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }
            ]).toArray()
            resolve(wishlistItems)
        })
    },
    removeWishlistProduct: (details) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collections.WISHLIST)
                .updateOne({ _id: objectId(details.wishlist) },
                    {
                        $pull: { products: { item: objectId(details.product) } }
                    }
                ).then((response) => {
                    resolve({ removeProduct: true })
                })
        })
    },
    deleteWishlistProduct:(id)=>{
        return new Promise((resolve,reject)=>{

        })
    },
    
    addUserToCoupon :(coupon,userId)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collections.COUPON).updateOne({'details.offertext':coupon},{$set:{
                users:[userId]
            }})
            resolve()
        })
    },
    findRefferal :(refferal,amount) =>{
        return new Promise(async(resolve,reject)=>{
            refferalUser = await db.get().collection(collections.USER_COLLECTION).findOne({refferal:refferal});
            resolve(refferalUser);
            if(refferalUser)
            {
                refferalData = {
                    Amount : parseInt(amount),
                    Date:new Date().toDateString(),
                    Timestamp:new Date(),
                    status:"credited",
                    message:"Refferal Amount"
                }
                db.get().collection(collections.WALLET).updateOne({userId:refferalUser._id},{
                    $inc:{
                        Total:amount
                    },
                    $push:{
                        Transaction :refferalData
                    }
                })
            }
            else{

            }
        })
    },
    addReferalMoney :(userId)=>{
        return new Promise((resolve,reject)=>{
            refferalData = {
                Amount : parseInt(50),
                Date:new Date().toDateString(),
                Timestamp:new Date(),
                status:"credited",
                message:"Refferal Amount"
            }
            db.get().collection(collections.WALLET).updateOne({userId:userId},{
                $inc:{
                    Total:50
                },
                $push:{
                    Transaction :refferalData
                }
            })
        })
    },
    getUserWallet:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            userWallet = await db.get().collection(collections.WALLET).findOne({userId:objectId(userId)})
            resolve(userWallet)
        })
    },
    inventory:(products)=>{
        return new Promise(async(resolve,reject)=>{
            console.log("Hai I am here");
            console.log(products);
        })
    },
    findSigleProduct:(prodId,orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collections.ORDER).aggregate([
                {
                    $match: { _id: objectId(orderId)
                     }
                },
                {
                    $unwind: '$products'
                },
                {
                    $match:{
                        'products.item':objectId(prodId)
                    }
                },
                {
                    $lookup:{
                        from:collections.PRODUCT,
                        localField:'products.item',
                        foreignField:'_id',
                        as:'productDetails'
                    }
                },
                {
                    $unwind:'$productDetails'
                }
            ]).toArray()
         resolve(products);

        })
    },
    getReturnOrder :()=>{
        return new Promise(async(resolve,reject)=>{
           let  orders = await db.get().collection(collections.ORDER).aggregate([{
                $match:{
                    'products.trackOrder':"return requested"
                }
            },
            {
                $unwind: '$products'
            },
            {
                $match:{
                    'products.trackOrder':"return requested"
                }
            },
            {
                $lookup:{
                    from:collections.PRODUCT,
                    localField:'products.item',
                    foreignField:'_id',
                    as:'productDetails'
                }
            },
            {
                $unwind:'$productDetails'
            }
            ]).toArray()
            resolve(orders)
        })
    }
    
    
}       