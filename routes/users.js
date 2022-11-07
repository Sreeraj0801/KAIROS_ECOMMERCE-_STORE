const express = require('express');
const session = require('express-session');
const { resolve } = require('promise');
const router = express.Router();
const userHelpers = require('../services/userHelpers')

const paypal = require('paypal-rest-sdk');
const { log } = require("console")
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id':process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

/* <----------------- Requiring Controllers -------------------> */

const { userLoginPage, userLogin, signUp, logOut } = require("../controller/userController");
const { userCheck } = require("../controller/sessionController");
const { phoneLoginPage, phoneLogin,otpForgetLoginPage ,otpLoginPage, resendOtp, otpLogin ,forgetOtp } = require("../controller/otpController");
const { userHomePage } = require("../controller/userHomeController");
const { userCategory, userCategoryProducts } = require("../controller/categoryController");
const { userBrand } = require('../controller/brandController');
const { userSingleProductsPage, userAllProducts } = require('../controller/productController');
const { userCartPage, userCart, cartProductsQty, removeProducts } = require('../controller/cartController');
const { checkoutPage, placeOrder } = require('../controller/checkoutController')
const { profilePage, viewOrderProducts, cancelOrder, addAddressPage,              //...start
  addAddress,userChangePassword, updateUserDetails, updateAdressPage, 
  updateAddress,deleteUserAddress} = require('../controller/profileController')   //....end
const productHelpers = require('../services/productHelpers');
const { response } = require('express');


let transaction

/* <----------------- Get Login and SignUp page -------------------> */
router.get('/login', userLoginPage);

/* <---------------------- Post  Login Page -----------------------> */
router.post("/login", userLogin);

/* <---------------------- Post User SignUp -----------------------> */
router.post('/signup', signUp);

/* <---------------------- Get log out ----------------------------> */
router.get("/logout", logOut);
// router.post("/logout",userCheck,logOut);

/* <---------------------- get PhoneLogin Page --------------------> */
router.get('/phoneLogin', phoneLoginPage);

/* <--------------------- Post PhoneLogin Page --------------------> */
router.post('/phoneLogin', phoneLoginPage);

// <------------------ post of phone number - sendcode  -----------> */
router.post("/sendcode", phoneLogin);

// <------------------------ Get OTP Login Page  ------------------> */
router.get('/otpLogin', otpLoginPage);

// <------------------------ Post Resend OTP code  ----------------> */
router.post("/resendcode", resendOtp);

// <------------------------ Post Otp Login - Verify  -------------> */
router.post("/verify", otpLogin);


router.post("/forgetPword", forgetOtp);
// <----------------------------- Get Home Page -------------------> */
router.post('/', userHomePage);

// <-----------------------------Post Home Page -------------------> */
router.get('/', userHomePage);

// <--------------------------- Get Category page -----------------> */
router.get('/category', userCategory);

// <---------------------------- Get Brand page -------------------> */
router.get('/Brand', userBrand);

// <------------------------- Get singleProduct page --------------> */
router.get('/product/:id', userSingleProductsPage);

// <---------------------- Get All Products Page ------------------> */
router.get('/product', userAllProducts);

// <------------------------ Get Cart Page ------------------------> */
router.get('/cart', userCheck, userCartPage);

// <------------------------Post Cart Page ------------------------> */
router.get('/addToCart/:id', userCheck, userCart);

// <-------------------- Get Cart Products ------------------------> */
router.get('/categoryProducts/:id', userCheck, userCategoryProducts);

// <------------- Post change product Quantity -------------------> */
router.post('/changeProductQuantity', userCheck,cartProductsQty)

// <----------------- Post Remove Products ------------------------> */
router.post('/removeProduct', userCheck,removeProducts)

// <-------------------- Get checkout Page -------------------------> */
router.get('/checkout', userCheck, checkoutPage)

// <--------------------- post place order -------------------------> */
router.post('/placeOrder', userCheck, placeOrder)

// <--------------------- Get profile page -------------------------> */
router.get('/profile', userCheck, profilePage)

// <-------------------get View Order Products ---------------------> */
router.get('/viewOrderProducts/:id', userCheck, viewOrderProducts)

// <---------------------get Cancel OrderProduct--------------------> */
router.get('/cancelOrder/:id', cancelOrder)

// <-------------------------User Add Address Page------------------> */
router.get('/addAddress', userCheck, addAddressPage)

// <----------------------------Post Add Address -------------------> */
router.post('/addAddress', userCheck, addAddress)

// <----------------------------Post Change Password ---------------> */
router.post('/changePassword', userCheck, userChangePassword)

// <----------------------Put Update User Details ------------------> */
router.put('/updateUserDetails', userCheck, updateUserDetails)

// <---------------------- Update User Address Page ----------------> */
router.get('/updateAddress/:id', userCheck, updateAdressPage)

// <-------------------------- Update User Address  ----------------> */
router.put('/updateAddress',userCheck, updateAddress)

// <-------------------------- Delete User Address  ----------------> */
router.delete('/deleteAddress',userCheck,deleteUserAddress)


router.post('/verifyPayment',(req,res)=>{
  userHelpers.verifyPayment(req.body).then((response)=>{
    transaction = req.body
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      res.json({status:true})
    })
  }).catch((err)=>{
    console.log(err);
    res.json({staus:false})
  })
})

router.get('/success', (req, res) => {
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
})

router.get('/cancel', (req, res) => res.send('Cancelled'));


// <-------------------- Sample for trial  ----------------------> */
router.get('/sample', userCheck,async (req, res) => {
  res.render('users/sample',{user:true,loggedIn: req.session.userLoggedIn})
})
const client = require('twilio')(process.env.TWELIO_SID_KEY,process.env.TWELIO_SECRET_KEY)


router.post('/mobileNumber',(req,res)=>{
  res.json({status:true});
})

router.post('/changePword',async(req,res)=>{
  userHelpers.changeForgetPword(req.session.phonenumber,req.body).then((status)=>{
    req.session.phonenumber = null;
    res.json(status)
  })
})

router.get('/returnOrder/:id',(req,res)=>{
  // userHelpers.returnProducts(req.params.id)
  let id = req.params.id;
  res.render('users/returnForm',{user:true,id})
})

router.post('/returnOrder',(req,res)=>{
  userHelpers.returnOrder(req.body)
})

router.post("/searchProduct",(req,res)=>{
  userHelpers.productSearch(req.body).then((products)=>{
    res.render('users/searchProduct',{products,user:true})
  })
})
module.exports = router;

