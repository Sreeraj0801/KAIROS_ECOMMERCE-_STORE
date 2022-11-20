const { log } = require("debug/src/browser");
const productHelpers = require("../services/productHelpers");
const { logOut } = require("./userController");

/* <-----------------Get AdminHome Page -------------------> */
module.exports.adminHome = async function (req, res, next) {
  let dailySales = await productHelpers.getDailysSales();
  let monthlySales = await productHelpers.getMonthlySales(); 
  let yearlySales = await productHelpers.getYearlySales();
  let topSellingProducts = await productHelpers.topSellingProducts();
  let Daily = await productHelpers.getDailysSales();
  let Monthly = await productHelpers.getMonthlySales(); 
  let Yearly = await productHelpers.getYearlySales(); 
  let customers = await productHelpers.getCustomers();
  res.render('admin/adminHome', { admin: true,dailySales,monthlySales,yearlySales,Daily,Monthly,Yearly,customers,topSellingProducts});
  };