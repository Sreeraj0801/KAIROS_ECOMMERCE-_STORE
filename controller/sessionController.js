const session = require('express-session');
const userHelpers = require('../services/userHelpers')

let sessionVar
module.exports = {
 /* <---------------------- User Session Check -----------------------> */
 userCheck : async function (req,res,next){
  req.session.userLoggedIn ? next():res.redirect("/login")
  },

 /* <---------------------- Admin Session Check -----------------------> */
sessionCheck : async function (req, res, next) {
  if (req.session.adminLoggedIn) {
    next()
  }
  else {
    res.redirect("/admin/")
  }
}
}


