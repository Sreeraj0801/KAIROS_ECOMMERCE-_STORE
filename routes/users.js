const express = require('express');
const session = require('express-session');
const { resolve } = require('promise');
const router = express.Router();
const userHelpers = require('../services/userHelpers')
const paypal = require('paypal-rest-sdk');
const { log } = require("console")
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

/* <----------------- Requiring Controllers -------------------> */

const { userLoginPage, userLogin, signUp, logOut } = require("../controller/userController");
const { userCheck } = require("../controller/sessionController");
const { phoneLoginPage, phoneLogin, otpForgetLoginPage, changePword, updatePassword,
  phonePage, otpLoginPage, resendOtp, otpLogin, forgetOtp, OTPpage, forgetPhone, mobilNumberPage, changePassword } = require("../controller/otpController");
const { userHomePage } = require("../controller/userHomeController");
const { userCategory, userCategoryProducts, brandProductsSearch } = require("../controller/categoryController");
const { userBrand } = require('../controller/brandController');
const { userSingleProductsPage, userAllProducts, serchProduct } = require('../controller/productController');
const { userCartPage, userCart, cartProductsQty, removeProducts, wishlistPage, addToWishlist, removeWishlistProducts } = require('../controller/cartController');
const { checkoutPage, placeOrder, verifyPayment, paypaySucess, sample, applyCoupon, SamplePage } = require('../controller/checkoutController')
const { profilePage, viewOrderProducts, cancelOrder, addAddressPage,              //...start
  addAddress, userChangePassword, updateUserDetails, updateAdressPage,
  updateAddress, deleteUserAddress ,profileAddAddress} = require('../controller/profileController')   //....end
const productHelpers = require('../services/productHelpers');
const { requestReturnPage, cancelOrderdProduct, returnOrderProduct, returnRequestPage } = require('../controller/orderController')
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
// router.post('/phoneLogin', phoneLoginPage);

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
router.get('/addToCart/:id', userCart);

// <-------------------- Get Cart Products ------------------------> */
router.get('/categoryProducts/:id', userCategoryProducts);

// <------------- Post change product Quantity -------------------> */
router.post('/changeProductQuantity', userCheck, cartProductsQty)

// <----------------- Post Remove Products ------------------------> */
router.post('/removeProduct', userCheck, removeProducts)

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
router.post('/addAddress', addAddress)

// <----------------------------Post Change Password ---------------> */
router.post('/changePassword', userCheck, userChangePassword)

// <----------------------Put Update User Details ------------------> */
router.put('/updateUserDetails', userCheck, updateUserDetails)

// <---------------------- Update User Address Page ----------------> */
router.get('/updateAddress/:id', userCheck, updateAdressPage)

// <-------------------------- Update User Address  ----------------> */
router.put('/updateAddress', userCheck, updateAddress)

// <-------------------------- Delete User Address  ----------------> */
router.delete('/deleteAddress', userCheck, deleteUserAddress)

// <-------------------------- User verify Payment  ----------------> */
router.post('/verifyPayment', verifyPayment)

// <---------------------- User PayPal Payment Success  ------------> */
router.get('/success', paypaySucess)

// <-------------------- User PayPal Payment Cancelled  ------------> */
router.get('/cancel', (req, res) => res.send('Cancelled'));

// <--------------------- Sample for trial  ------------------------> */
router.get('/sample', userCheck, sample)

// <---------------------- Mobile Number Page  ---------------------> */
router.post('/mobileNumber', mobilNumberPage)

// <---------------------- Change Password  ------------------------> */
router.post('/changePword', changePassword)

// <--------------------- Request Retun Page  -----------------------> */
router.get('/returnOrder/:id', requestReturnPage)

// <---------------------- Search Products   -------------------------> */
router.post("/searchProduct", serchProduct)

// <------------------------ Wishlist Page   --------------------------> */
router.get('/wishlist', userCheck, wishlistPage)

// <------------------------ Add to  Wishlist  -------------------------> */
router.get('/addToWishlist/:id', userCheck, addToWishlist)

// <------------------------ Remove Wishlist Products -------------------> */
router.post('/removeWishlistProduct', userCheck, removeWishlistProducts)

// <--------------------------- Apply Coupon  ---------------------------> */
router.post('/applycoupon', applyCoupon)

// <----------------------- Sample Page For Demo Purpose  ---------------> */

router.get('/samplepage', SamplePage)

// <---------------------------- Phone Number Page   --------------------> */
router.get('/phoneNumber', phonePage)

// <---------------------------- Forget Phone    --------------------> */
router.post('/forgetPhone', forgetPhone);

// <---------------------------- get OTP page     --------------------> */
router.get('/otp', OTPpage)

// <------------------------- Forget password OTP --------------------> */
router.post('/forgetOtp', forgetOtp)

// <------------------------- Change Password Page --------------------> */
router.get('/changePassword', changePword)

// <--------------------------- Update Password -----------------------> */
router.post('/updatePassword', updatePassword)

// <--------------------------- get Cancel Order -----------------------> */
router.get('/cancelOrder/:id', cancelOrder);

// <--------------------------- put  Cancel Order -----------------------> */
router.put('/cancelOrderProduct', cancelOrderdProduct)

// <-------------------------- Return Ordered Product --------------------> */
router.put('/returnOrderProduct', returnOrderProduct)

// <-------------------------- Return Request Page  ----------------------> */
router.get('/returnOrder/:prodId/:orderId', returnRequestPage)

// <-------------------------- Brand Products Page  ----------------------> */
router.get('/brandProducts/:id', brandProductsSearch)

router.post('/addAdd',profileAddAddress)

router.post('/cartCount',async(req,res)=>{
  let cartCount = await userHelpers.getCartCount(req.session.user._id);
  req.session.cartCount = cartCount;
  res.json({status:true})
})
module.exports = router;