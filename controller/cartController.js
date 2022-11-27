const { log } = require('debug/src/browser')
const session = require('express-session')
const async = require('hbs/lib/async')
const productHelpers = require('../services/productHelpers')
const userHelpers = require('../services/userHelpers')

// <------------------------ Get Cart Page ------------------------>
module.exports.userCartPage = async (req, res, next) => {
    try {
        let products = await userHelpers.getCartProducts(req.session.user._id)
        let total = 0;
        if (products.length > 0) {
            total = await userHelpers.getTotalAmount(req.session.user._id)
        }
        userDetails = req.session ;
        cartCount = req.session.cartCount;
        console.log("ppppppppppppppppppppppppp"+cartCount);
        res.render('users/cart', { user: true,userDetails,cartCount, 'userId': req.session.user._id, products, total: total[0] })
    } catch (error) {
        console.log(error);
    }
}
// <------------------------Post Cart Page ------------------------>
module.exports.userCart = async (req, res) => {

    try {
        if (req.session.userLoggedIn) {
            userHelpers.addToCart(req.params.id, req.session.user._id).then(async() => {
                let cartCount = await userHelpers.getCartCount(req.session.user._id);
                req.session.cartCount = cartCount;
                userHelpers.deleteWishlistProduct(req.params.id)
                value = {
                    status:true,
                    cartCount:cartCount
                }          
                res.json(value)
            })
        }
        else {
          
            res.json({status:false})
        }
    } catch (error) {

        res.send(error)
    }
}

// <------------- Post change product Quantity --------------------> */
module.exports.cartProductsQty = async (req, res, next) => {
    try {
        userHelpers.changeProductQuantity(req.body).then(async (response) => {
            response.total = await userHelpers.getTotalAmount(req.body.user);
            res.json(response)
        })
    } catch (error) {
        console.log(error);
    }
}

// <----------------- Post Remove Products ------------------------> */
module.exports.removeProducts = async (req, res, next) => {
    try {
        userHelpers.removeProduct(req.body).then(async(response) => {
            let cartCount = await userHelpers.getCartCount(req.session.user._id);
            req.session.cartCount = cartCount;
            res.json(response)
        })
    } catch (error) {

    }
}
// <------------------------ Wishlist Page   --------------------------> */
module.exports.wishlistPage = async (req, res) => {
    {
      let products = await userHelpers.getWishlistProducts(req.session.user._id);
      let total = 0;
      userDetails = req.session;
      cartCount = req.session.cartCount;
      res.render('users/wishlist', { user: true, userDetails, cartCount, 'userId': req.session.user._id, products, total: total[0] })
    }
  }
// <------------------------ Add to  Wishlist  --------------------------> */
module.exports.addToWishlist = async (req, res) => {
    if (req.session.userLoggedIn) {
      userHelpers.addToWishlist(req.params.id, req.session.user._id).then((response) => {
        res.json(response)
      })
    }
    else {
      const response = false;
      res.json(response)
    }
  }

  module.exports.removeWishlistProducts = async (req, res) => {
    userHelpers.removeWishlistProduct(req.body).then((response) => {
      res.json(response)
    })
  }