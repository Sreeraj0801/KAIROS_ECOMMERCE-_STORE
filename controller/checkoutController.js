const { response } = require('express');
const session = require('express-session')
const productHelpers = require('../services/productHelpers')
const userHelpers = require('../services/userHelpers');
const { logOut } = require('./userController');


// <-------------------- Get checkout Page -------------------------> */
module.exports.checkoutPage = async (req,res,next)=>{
    try {
    let products = await userHelpers.getCartProducts(req.session.user._id)
    var total = await userHelpers.getTotalAmount(req.session.user._id);
    let address = await userHelpers.getAddress(req.session.user._id);
    let coupons = await productHelpers.getAllCoupons()
    if(products.length > 0)
    {
      res.render('users/checkout',{user:true,total:total[0],user:req.session.user,address ,products,coupons});
    }
    else{
      res.redirect("/cart")
    }
    } catch (error) {
        
    }
  }
  // <--------------------- post place order -------------------------> */
module.exports.placeOrder = async(req,res)=>{
      try {
    let products = await userHelpers.getCartProductList(req.session.user._id);
    let totalPrice = await userHelpers.getTotalAmount(req.session.user._id);
    let address = await userHelpers.getSingleAddress(req.body.plan);
    let paymentMethod = req.body.paymentMethod;;
    if(req.body.coupon)
    {
      userHelpers.placeOrder(address,products,totalPrice,paymentMethod).then((orderId)=>{
        console.log(paymentMethod);
        let result ={
          paymentMethod:paymentMethod,
          orderId:orderId
        }
        if(paymentMethod === 'COD')
        {
        res.json(result)
        }
        else if(paymentMethod == 'Razorpay'){
          userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
            response.paymentMethod = paymentMethod;
            res.json(response)
          })
        }
        else if(paymentMethod == 'Paypal') 
        {
         userHelpers.generatePaypal(orderId,totalPrice).then((link)=>{
          res.json(link)
          })
        }     
      })
    }
    else{
      userHelpers.placeOrder(address,products,totalPrice,paymentMethod).then((orderId)=>{
        console.log(paymentMethod);
        let result ={
          paymentMethod:paymentMethod,
          orderId:orderId
        }
        if(paymentMethod === 'COD')
        {
        res.json(result)
        }
        else if(paymentMethod == 'Razorpay'){
          userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
            response.paymentMethod = paymentMethod;
            res.json(response)
          })
        }
        else if(paymentMethod == 'Paypal') 
        {
         userHelpers.generatePaypal(orderId,totalPrice).then((link)=>{
          res.json(link)
          })
        }     
      })
    }
    } catch (error) {
        
    }
  }