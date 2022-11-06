const productHelpers = require("../helpers/productHelpers");
const { logOut } = require("./userController");

/* <-----------------Get AdminHome Page -------------------> */
module.exports.adminHome = async function (req, res, next) {
  let dailySales = await productHelpers.getDailysSales();
  let monthlySales = await productHelpers.getMonthlySales(); 
  let yearlySales = await productHelpers.getYearlySales();
  console.log(monthlySales);
  console.log(dailySales);
    res.render('admin/adminHome', { admin: true,dailySales,monthlySales,yearlySales});
  };