const { ObjectID } = require('bson');
var express = require('express');
const session = require('express-session');
var router = express.Router();


/* <----------------- Requiring Controllers -------------------> */

const {sessionCheck} = require("../controller/sessionController");
const {adminLoginPage ,postAdminLogin,signout} = require("../controller/adminController");
const {adminHome} = require("../controller/adminHomeController");
const {adminViewUsers ,blockUser ,unBlockUser} = require("../controller/adminUsersController")
const {addCategoryPage ,postAddCategoryPage ,viewCategoryPage ,editCategory ,postEditCategory
,deleteCategory} = require("../controller/categoryController") //------------end
const {addBrandsPage ,addBrand ,viewBrand ,editbrandPage
,editBrand,deleteBrand} =require("../controller/brandController") //---------end
const {viewProdutsPage,addProductsPage ,addProducts ,editProductsPage , editProducts,deleteProducts ,stockUpdate} = require("../controller/productController")
const {viewBannerPage,addBannerPage ,addBanner ,editBannerPage 
,editBanner ,deleteBanner} = require("../controller/bannerController"); //-----end
const {adminViewOrdersPage,UpdateTrackOrder} = require('../controller/orderController.js')
const productHelpers = require('../services/productHelpers');
const { Db, Admin } = require('mongodb');
const userHelpers = require('../services/userHelpers');
const { upload, uploadBrand } = require('../public/javascripts/fileUpload');
const { logOut } = require('../controller/userController');
const { response } = require('express');
const async = require('hbs/lib/async');
const { resolve } = require('promise');
const { log } = require('debug/src/browser');





/* <----------------- get login  page-------------------> */
router.get('/', adminLoginPage);

/* <----------------- Post login  page-------------------> */
router.post('/',postAdminLogin)

/* <------------------ signout root ---------------------> */
router.get('/signout',signout);

/* <------------------  GET home page -------------------> */
router.get('/home', sessionCheck,adminHome);

/* <-----------------  view Users page ------------------> */
router.get('/viewUsers',sessionCheck,adminViewUsers);

/* <-----------------  user Block button ----------------> */
router.get('/userBlock/:id', sessionCheck,blockUser)

/* <-----------------  user Unblock button --------------> */
router.get('/userUnBlock/:id',sessionCheck,unBlockUser)

/* <-----------------  Add Category page ----------------> */
router.get('/addCategory', sessionCheck, addCategoryPage);

/* <-----------------  Post Category page ---------------> */
router.post('/addCategory',sessionCheck,postAddCategoryPage);

/* <---------------  Get View Category Page -------------> */
router.get('/viewCategory', sessionCheck,viewCategoryPage);

/* <---------------  Get Edit Category Page --------------> */
router.get('/editCategory/:id', sessionCheck,editCategory)

/* <---------------  Post Edit Category Page -------------> */
router.post('/editCategory/:id',sessionCheck,postEditCategory)

/* <---------------  Post Delete Category Page -----------> */
router.get('/deleteCategory/:id',sessionCheck,deleteCategory)

/* <---------------  Add Brand Category page -------------> */
router.get('/addBrand', sessionCheck,addBrandsPage);

/* <----------------  Add Brand Category -----------------> */
router.post('/addBrand',sessionCheck,uploadBrand.any('image'),addBrand)

/* <----------------  View Brand Category ----------------> */
router.get('/viewBrand', sessionCheck,viewBrand);

/* <-----------------  Get Edit Brand --------------------> */
router.get('/editBrand/:id', sessionCheck, upload.any('image') ,editbrandPage)

/* <-----------------  Post Edit Brand -------------------> */
router.post('/editBrand/:id',sessionCheck,uploadBrand.any('image'),editBrand)

/* <-------------------  Delete Brand --------------------> */
router.get('/deleteBrand/:id',deleteBrand)

/* <----------------  View Products page -----------------> */
router.get('/viewProducts', sessionCheck,viewProdutsPage);

/* <----------------  Add Products page ------------------> */
router.get('/addProducts', sessionCheck,addProductsPage)

/* <---------------- Post Add Products page --------------> */
router.post('/addProduct',sessionCheck,upload.array('image'), addProducts)

/* <------------------ Edit Products page ----------------> */
router.get('/editProducts/:id', sessionCheck,editProductsPage);

/* <--------------------Put Edit Products  ---------------> */
router.post('/editProducts/:id',editProducts)

/* <--------------------Delete  Products  -----------------> */
router.get('/deleteProduct/:id',sessionCheck,deleteProducts)

/* <--------------------View Banner Page  -----------------> */
router.get('/viewBanner', sessionCheck,viewBannerPage );
/* <--------------------Add Banner Page  ------------------> */
router.get('/addBanner', sessionCheck, addBannerPage);

/* <-------------------- Post Add Banner -------------------> */
router.post('/addBanner',addBanner)

/* <--------------------  Edit Banner Page -----------------> */
router.get('/editBanner/:id', sessionCheck, editBannerPage);

/* <--------------------Put   Edit Banner  -----------------> */
router.post('/editBanner/:id', sessionCheck,editBanner)
/* <--------------------Put   Edit Banner  -----------------> */

/* <------------------- Get Delete Banner  -----------------> */
router.get('/deleteBanner/:id', sessionCheck,deleteBanner )

/* <------------------- Post Update Stock ------------------> */
router.post('/stockUpdate/:id', sessionCheck,stockUpdate )

/* <----------------- Admin View Order Page ----------------> */
router.get('/viewOrders', sessionCheck,adminViewOrdersPage)

/* <---------------- Admin Update Track Order --------------> */
router.put('/updateTrackOrder', sessionCheck,UpdateTrackOrder)

router.get('/returnOrder',async (req,res)=>{
let orders = await userHelpers.getReturnOrder()
console.log(orders);
res.render('admin/returnOrders',{admin:true,orders})
})

router.get('/salesReport',async (req,res)=>{
  let DailySalesforDownload = await productHelpers.getDailysSales();
  let MonthlySalesforDownload = await productHelpers.getMonthlySales(); 
  let YearlySalesforDownload = await productHelpers.getYearlySales(); 
  res.render('admin/salesReport',{admin:true,DailySalesforDownload,MonthlySalesforDownload,YearlySalesforDownload})
})

router.get('/productOffers',async (req,res)=>{
  products = await productHelpers.getAllProduct();
  res.render('admin/productOffers',{admin:true,products})})

  router.post('/addProductOffer',(req,res)=>{
    productHelpers.addproductOffer(req.body).then((response)=>{
      res.json(response)
    }).catch((err)=>{
      console.log(err);
    })
  })

  router.delete('/removeProductOffer',async (req,res)=>{
    console.log(req.body.id);
    productHelpers.removeProductOffer(req.body.id).then((response)=>{
      res.json(response)
    })
  })

  router.get('/coupon',sessionCheck, async(req,res)=>{
    productHelpers.checkCoupon();
    coupons =  await productHelpers.getAllCoupons();
    res.render('admin/viewCoupon',{admin:true,coupons})
  })

  router.get('/addCoupoun',(req,res)=>{
    res.render('admin/addCoupoun',{admin:true});
  })
  router.post('/addCoupon',(req,res)=>{
    productHelpers.addCoupon(req.body).then((response)=>{
      res.json(response)
    })
  })

  router.delete('/removeCoupon',async (req,res)=>{
    productHelpers.removeCoupon(req.body.id).then((response)=>{
      res.json(response)
    })
  })

  router.put('/returnOrderProduct',(req,res)=>{
    let orderId = req.body.orderId;
    let prodId = req.body.prodId;
    let status = "return approved";
    let refund = req.body.refund;
    let userId = req.body.userId;
    let message = null;
    userHelpers.updateTrackOrder (orderId,prodId,status,message,refund,userId).then((response)=>{
     res.json(response)
   })
})

 
  
module.exports = router;