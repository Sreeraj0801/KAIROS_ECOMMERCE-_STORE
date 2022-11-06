var blockButton ;

/* <----------------- #Requiring Helpers -------------------> */
const userHelpers = require('../helpers/userHelpers');
var productHelpers = require('../helpers/productHelpers');





/* <------------- get admin view users  page --------------> */
module.exports.adminViewUsers = async function (req, res, next) {
    productHelpers.viewUsers().then((userDetails) => {
      res.render('admin/viewUsers', { admin: true, userDetails, blockButton });
    })
  }

/* <---------------- get admin Block User ------------------> */
  module.exports.blockUser = async (req, res) => {
    blockButton = await userHelpers.userBlock(req.params.id)
    res.redirect('/admin/viewUsers')
  }

  /* <---------------- get admin UnBlock User ---------------> */
module.exports.unBlockUser = async (req, res) => {
    blockButton = await userHelpers.userUnblock(req.params.id)
    res.redirect('/admin/viewUsers')
  }
