const session = require('express-session')
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
        res.render('users/cart', { user: true,userDetails,cartCount, 'userId': req.session.user._id, products, total: total[0] })
    } catch (error) {
        console.log(error);
    }
}
// <------------------------Post Cart Page ------------------------>
module.exports.userCart = async (req, res) => {
    try {
        if (req.session.userLoggedIn) {
            userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
                res.json({ status: true })
            })
        }
        else {
            const response = false;
            res.json(response)
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
        userHelpers.removeProduct(req.body).then((response) => {
            res.json(response)
        })
    } catch (error) {

    }
}
