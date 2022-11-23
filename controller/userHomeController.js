const { log } = require('debug/src/browser')
const { Db } = require('mongodb')
const { getAllCategoryBrands, getAllBrand } = require('../services/productHelpers')
const productHelpers = require('../services/productHelpers')
const userHelpers = require('../services/userHelpers')


 /* <---------------------- Get User HomePage -----------------------> */
module.exports.userHomePage = async function (req, res, next) {
  
    productHelpers.newProducts().then((products) => {
    productHelpers.getAllCategory().then((category)=>{
    productHelpers.getBanner().then(async(banner) =>{
      brands = await getAllBrand();
      let topSellingProducts = await productHelpers.topSellingProducts();
        if(req.session.userLoggedIn)
        { 
         let cartCount = await userHelpers.getCartCount(req.session.user._id)
          req.session.cartCount = cartCount;
          userDetails = req.session ;
          cartCount = req.session.cartCount;
          res.render('users/home', {products ,category,banner,brands ,userDetails,cartCount,topSellingProducts ,user:user = true})
        }else{
          res.render('users/home', { products ,category,banner ,brands,topSellingProducts,user:user = true})
        } 
      }) 
    })
    })
  }