const { log } = require('debug/src/browser');
const { response } = require('express');
const session = require('express-session')
const productHelpers = require('../services/productHelpers')
const userHelpers = require('../services/userHelpers');
const { logOut } = require('./userController');
const paypal = require('paypal-rest-sdk');
const async = require('hbs/lib/async');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});


// <-------------------- Get checkout Page -------------------------> */
module.exports.checkoutPage = async (req,res,next)=>{
    try {
    let products = await userHelpers.getCartProducts(req.session.user._id)
    var total = await userHelpers.getTotalAmount(req.session.user._id);
    let address = await userHelpers.getAddress(req.session.user._id);
    let coupons = await productHelpers.getAllCoupons();
    let walletBallence = await productHelpers.gerWalletBalance(req.session.user._id);
    let cartCount = req.session.cartCount;
    let userDetails = req.session ;
    if(products.length > 0)
    {
      res.render('users/checkout',{user:true,total:total[0],user:req.session.user,address ,products,coupons,walletBallence,cartCount,userDetails});
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
    let paymentMethod = req.body.paymentMethod;
    totalPrice = totalPrice[0].total;
    if(req.body.coupon)
    {
      totalPrice = req.body.offerPrice;
      await userHelpers.addUserToCoupon(req.body.coupon,req.session.user._id)
      userHelpers.placeOrder(address,products,totalPrice,paymentMethod,req.body).then((orderId)=>{
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
        else if(paymentMethod == 'wallet')
        {
          userHelpers.walletPayment(totalPrice,req.session.user._id).then((respose)=>{
            response.paymentMethod = paymentMethod;
            response.walletPayment = true;
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
        let result ={
          paymentMethod:paymentMethod,
          orderId:orderId
        }
        if(paymentMethod === 'COD')
        {
          userHelpers.inventory(products)
          res.json(result)
        }
        else if(paymentMethod == 'wallet')
        {
          userHelpers.walletPayment(totalPrice,req.session.user._id).then((respose)=>{
            response.paymentMethod = paymentMethod;
            response.walletPayment = true;
            res.json(response)
          })
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

  // <--------------------- post verify Payment ------------------------> */
  module.exports.verifyPayment = async (req, res) => {
    userHelpers.verifyPayment(req.body).then((response) => {
      transaction = req.body
      userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
        res.json({ status: true })
      })
    }).catch((err) => {
      console.log(err);
      res.json({ staus: false })
    })
  }

  // <---------------------Paypal Payment Success ----------------------> */
  module.exports.paypaySucess = async (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": "25.00"
        }
      }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log(JSON.stringify(payment));
        res.redirect('/sample')
      }
    });
  }

  // <---------------------Sample Page for demo - -------------------------> */
  module.exports.sample = async (req, res) => {
    res.render('users/sample', { user: true, loggedIn: req.session.userLoggedIn })
  }
  
// <--------------------------- Apply Coupon  ---------------------------> */
  module.exports.applyCoupon = async (req, res) => {
    productHelpers.findCoupon(req.body, req.session.user._id).then((response) => {
      res.json(response)
    })
  }

  // <-----------------Sample Page for demo Purpose - ---------------------> */
  module.exports.SamplePage = async  (req, res) => {
    productHelpers.getAllProduct().then((products) => {
      productHelpers.getAllCategory().then((category)=>{
        productHelpers.getBanner().then(async(banner) =>{
          if(req.session.userLoggedIn)
          { 
           let cartCount = await userHelpers.getCartCount(req.session.user._id)
            req.session.cartCount = cartCount;
            userDetails = req.session ;
            cartCount = req.session.cartCount;
            res.render('users/samplePage', {products ,category,banner ,userDetails,cartCount ,user:user = true})
          }else{
            res.render('users/samplePage')
          } 
        }) 
      })
      })
    }