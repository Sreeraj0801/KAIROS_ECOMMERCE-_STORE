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
router.get('/userBlock/:id', blockUser)

/* <-----------------  user Unblock button --------------> */
router.get('/userUnBlock/:id',unBlockUser)

/* <-----------------  Add Category page ----------------> */
router.get('/addCategory', sessionCheck, addCategoryPage);

/* <-----------------  Post Category page ---------------> */
router.post('/addCategory',postAddCategoryPage);

/* <---------------  Get View Category Page -------------> */
router.get('/viewCategory', sessionCheck,viewCategoryPage);

/* <---------------  Get Edit Category Page --------------> */
router.get('/editCategory/:id', sessionCheck,editCategory)

/* <---------------  Post Edit Category Page -------------> */
router.post('/editCategory/:id',postEditCategory)


/* <---------------  Post Delete Category Page -----------> */
router.get('/deleteCategory/:id',deleteCategory)

/* <---------------  Add Brand Category page -------------> */
router.get('/addBrand', sessionCheck,addBrandsPage);

/* <----------------  Add Brand Category -----------------> */
router.post('/addBrand',addBrand)

/* <----------------  View Brand Category ----------------> */
router.get('/viewBrand', sessionCheck,viewBrand);

/* <-----------------  Get Edit Brand --------------------> */
router.get('/editBrand/:id', sessionCheck ,editbrandPage)

/* <-----------------  Post Edit Brand -------------------> */
router.post('/editBrand/:id',editBrand)

/* <-------------------  Delete Brand --------------------> */
router.get('/deleteBrand/:id',deleteBrand)

/* <----------------  View Products page -----------------> */
router.get('/viewProducts', sessionCheck,viewProdutsPage);

/* <----------------  Add Products page ------------------> */
router.get('/addProducts', sessionCheck,addProductsPage)


/* <---------------- Post Add Products page --------------> */
  router.post('/addProduct', addProducts)

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

router.get('/returnOrder',(req,res)=>{
res.render('admin/returnOrders',{admin:true})
})

module.exports = router;