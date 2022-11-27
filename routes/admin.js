const { ObjectID } = require('bson');
var express = require('express');
const session = require('express-session');
var router = express.Router();


/* <----------------- Requiring Controllers -------------------> */

const { sessionCheck } = require("../controller/sessionController");
const { adminLoginPage, postAdminLogin, signout } = require("../controller/adminController");
const { adminHome } = require("../controller/adminHomeController");
const { adminViewUsers, blockUser, unBlockUser } = require("../controller/adminUsersController")
const { addCategoryPage, postAddCategoryPage, viewCategoryPage, editCategory, postEditCategory
  , deleteCategory } = require("../controller/categoryController") //------------end
const { addBrandsPage, addBrand, viewBrand, editbrandPage
  , editBrand, deleteBrand } = require("../controller/brandController") //---------end
const { viewProdutsPage, addProductsPage, addProducts, editProductsPage, editProducts, deleteProducts, couponPage, addCouponPage,
  removeCoupon, addCoupon, stockUpdate, productOffer, addProductOffer, removeProductOffer } = require("../controller/productController")
const { viewBannerPage, addBannerPage, addBanner, editBannerPage
  , editBanner, deleteBanner } = require("../controller/bannerController"); //-----end
const { adminViewOrdersPage, UpdateTrackOrder, returnOrderPageAdmin, salesReport, returnOrderedProduct } = require('../controller/orderController.js')
const productHelpers = require('../services/productHelpers');
const { Db, Admin } = require('mongodb');
const userHelpers = require('../services/userHelpers');
const { upload, uploadBrand, uploadCategory, uploadBanner } = require('../public/javascripts/fileUpload');
const { logOut } = require('../controller/userController');
const { response } = require('express');
const async = require('hbs/lib/async');
const { resolve } = require('promise');
const { log } = require('debug/src/browser');





/* <----------------- get login  page-------------------> */
router.get('/', adminLoginPage);

/* <----------------- Post login  page-------------------> */
router.post('/', postAdminLogin)

/* <------------------ signout root ---------------------> */
router.get('/signout', signout);

/* <------------------  GET home page -------------------> */
router.get('/home', sessionCheck, adminHome);

/* <-----------------  view Users page ------------------> */
router.get('/viewUsers', sessionCheck, adminViewUsers);

/* <-----------------  user Block button ----------------> */
router.get('/userBlock/:id', sessionCheck, blockUser)

/* <-----------------  user Unblock button --------------> */
router.get('/userUnBlock/:id', sessionCheck, unBlockUser)

/* <-----------------  Add Category page ----------------> */
router.get('/addCategory', sessionCheck, addCategoryPage);

/* <-----------------  Post Category page ---------------> */
router.post('/addCategory', sessionCheck, uploadCategory.any('image'), postAddCategoryPage);

/* <---------------  Get View Category Page -------------> */
router.get('/viewCategory', sessionCheck, viewCategoryPage);

/* <---------------  Get Edit Category Page --------------> */
router.get('/editCategory/:id', sessionCheck, editCategory)

/* <---------------  Post Edit Category Page -------------> */
router.post('/editCategory/:id', uploadCategory.any('image'), sessionCheck, postEditCategory)

/* <---------------  Post Delete Category Page -----------> */
router.get('/deleteCategory/:id', sessionCheck, deleteCategory)

/* <---------------  Add Brand Category page -------------> */
router.get('/addBrand', sessionCheck, addBrandsPage);

/* <----------------  Add Brand Category -----------------> */
router.post('/addBrand', sessionCheck, uploadBrand.any('image'), addBrand)

/* <----------------  View Brand Category ----------------> */
router.get('/viewBrand', sessionCheck, viewBrand);

/* <-----------------  Get Edit Brand --------------------> */
router.get('/editBrand/:id', sessionCheck, uploadBrand.any('image'), editbrandPage)

/* <-----------------  Post Edit Brand -------------------> */
router.post('/editBrand/:id', sessionCheck, uploadBrand.any('image'), editBrand)

/* <-------------------  Delete Brand --------------------> */
router.get('/deleteBrand/:id', deleteBrand)

/* <----------------  View Products page -----------------> */
router.get('/viewProducts', sessionCheck, viewProdutsPage);

/* <----------------  Add Products page ------------------> */
router.get('/addProducts', sessionCheck, addProductsPage)

/* <---------------- Post Add Products page --------------> */
router.post('/addProduct', sessionCheck, upload.array('image'), addProducts)

/* <------------------ Edit Products page ----------------> */
router.get('/editProducts/:id', sessionCheck, editProductsPage);

/* <--------------------Put Edit Products  ---------------> */
router.post('/editProducts/:id', upload.array('image'), editProducts)

/* <--------------------Delete  Products  -----------------> */
router.get('/deleteProduct/:id', sessionCheck, deleteProducts)

/* <--------------------View Banner Page  -----------------> */
router.get('/viewBanner', sessionCheck, viewBannerPage);
/* <--------------------Add Banner Page  ------------------> */
router.get('/addBanner', sessionCheck, addBannerPage);

/* <-------------------- Post Add Banner -------------------> */
router.post('/addBanner', uploadBanner.any('image'), addBanner)

/* <--------------------  Edit Banner Page -----------------> */
router.get('/editBanner/:id', sessionCheck, editBannerPage);

/* <--------------------Put   Edit Banner  -----------------> */
router.post('/editBanner/:id', uploadBanner.any('image'), sessionCheck, editBanner)
/* <--------------------Put   Edit Banner  -----------------> */

/* <------------------- Get Delete Banner  -----------------> */
router.get('/deleteBanner/:id', sessionCheck, deleteBanner)

/* <------------------- Post Update Stock ------------------> */
router.post('/stockUpdate/:id', sessionCheck, stockUpdate)

/* <----------------- Admin View Order Page ----------------> */
router.get('/viewOrders', sessionCheck, adminViewOrdersPage)

/* <---------------- Admin Update Track Order --------------> */
router.put('/updateTrackOrder', sessionCheck, UpdateTrackOrder);

/* <---------------- Admin Return Requests Page ------------> */
router.get('/returnOrder', returnOrderPageAdmin);
 
/* <---------------- Admin Sales Report Page  ---------------> */
router.get('/salesReport', salesReport);

/* <--------------- Admin add Product Offers Page ------------> */
router.get('/productOffers', productOffer);
/* <--------------- Admin add Product Offers  ----------------> */
router.post('/addProductOffer', addProductOffer)

/* <--------------- Admin Remove Product Offers  -----------> */
router.delete('/removeProductOffer', removeProductOffer)

/* <--------------- Admin  Coupon Page -------------------> */
router.get('/coupon', sessionCheck, couponPage)

/* <--------------- Admin Add Coupon Page ------------------> */
router.get('/addCoupoun', addCouponPage)

/* <---------------- Admin Post Coupon  -------------------> */
router.post('/addCoupon', addCoupon)

/* <---------------- Admin Remove  Coupon  -------------------> */
router.delete('/removeCoupon', removeCoupon)

/* <-------------- put Return Order Product  -----------------> */
router.put('/returnOrderProduct', returnOrderedProduct)

router.get('/',async (req,res)=>{
  
  
})

router.get('/viewOrderProducts/:id',async(req,res)=>{
  let products = await userHelpers.getOrderProducts(req.params.id);
  console.log("{{{{{{{{{{{{{{{");
  console.log(products);
  res.render('admin/viewOrderProduct',{admin:true,products})
  
})

module.exports = router;