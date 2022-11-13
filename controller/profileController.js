const session = require('express-session')
const productHelpers = require('../services/productHelpers')
const userHelpers = require('../services/userHelpers')



// <--------------------- Get profile page -------------------------> */
module.exports.profilePage = async (req, res) => {
    try {
        let orders = await userHelpers.getUserOrders(req.session.user._id);
        let address = await userHelpers.getAddress(req.session.user._id);
        let UserDetails = await userHelpers.getUserDetails(req.session.user._id);
        cartCount = req.session.cartCount;
        userDetails = req.session ;
        let walletDetails = await userHelpers.getUserWallet(req.session.user._id)
        res.render('users/profile', { user: true, userDetails, orders, address, UserDetails,cartCount,walletDetails})
    } catch (error) {

    }
}

// <--------------------- User View Order Products -------------------> */
module.exports.viewOrderProducts = async (req, res) => {
    try {
        let products = await userHelpers.getOrderProducts(req.params.id)
        cartCount = req.session.cartCount;
        userDetails = req.session ;
        res.render('users/viewOrderProducts', { user: true,cartCount,userDetails, products })
    } catch (error) {

    }
}

// <---------------------get Cancel OrderProduct-------------------> */
module.exports.cancelOrder = async (req, res) => {
    try {
        cancel = "canceled";
        userHelpers.updateTrackOrder(req.params.id, cancel);
        res.redirect('/profile');
    } catch (error) {

    }
}
// <-------------------------User Add Address Page-------------------> */
module.exports.addAddressPage = async (req, res) => {
    try {
        res.render('users/addAddress', { user: true, loggedIn: req.session.userLoggedIn, user: req.session.user })
    } catch (error) {

    }
}

// <----------------------------Post Add Address -------------------> */
module.exports.addAddress = (req, res) => {
    try {
        userHelpers.addAddress(req.body)
        res.json({})
    } catch (error) {

    }
}
// <----------------------------User Change Password -------------------> */
module.exports.userChangePassword = (req, res) => {
    try {
        userHelpers.changePassword(req.body, req.session.user._id).then((status) => {
            res.json(status)
        })
    } catch (error) {

    }
}




// <----------------------Put Update User Details ------------------> */
module.exports.updateUserDetails = (req, res) => {
    try {
        userHelpers.updateUserDetails(req.body).then((status) => {
            res.json(status)
        })
    } catch (error) {

    }
}



// <---------------------- Update User Address Page ----------------> */
module.exports.updateAdressPage = async (req, res) => {
    try {
        userHelpers.getSingleAddress(req.params.id).then((address) => {
            res.render('users/updateAddress', { user: true, address })
        })
    } catch (error) {

    }
}

// <-------------------------- Update User Address  ----------------> */
module.exports.updateAddress = async (req, res) => {
    try {
        userHelpers.editAddress(req.body).then((response) => {
            res.json(response)
        })
    } catch (error) {
        
    }
}

// <-------------------------- Delete User Address  ----------------> */
module.exports.deleteUserAddress = async(req,res)=>{
    try {
      userHelpers.deleteAddress(req.body.addressId).then((response)=>{
        res.json(response)
      })
      
    } catch (error) {
        
    }
  }