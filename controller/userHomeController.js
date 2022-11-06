const productHelpers = require('../helpers/productHelpers')
const userHelpers = require('../helpers/userHelpers')


 /* <---------------------- Get User HomePage -----------------------> */
module.exports.userHomePage = async function (req, res, next) {
  
    productHelpers.getAllProduct().then((products) => {
    productHelpers.getAllCategory().then((category)=>{
      productHelpers.getBanner().then(async(banner) =>{
        if(req.session.userLoggedIn)
        {
         
          let cartCount = await userHelpers.getCartCount(req.session.user._id)
          req.session.cartCount = cartCount;
          userDetails = req.session ;
          cartCount = req.session.cartCount;
          res.render('users/home', {products ,category,banner ,userDetails,cartCount ,user:user = true})
        }else{
          res.render('users/home', { products ,category,banner ,user:user = true})
        } 
      }) 
    })
    })
  }