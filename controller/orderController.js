const { log } = require('debug/src/browser');
const session = require('express-session');
const async = require('hbs/lib/async');
const productHelpers = require('../services/productHelpers')
const userHelpers = require('../services/userHelpers')

/* <----------------- Admin View Order Page ---------------> */
module.exports.adminViewOrdersPage =  async (req,res)=>{
    try {
    let orders = await productHelpers.getOrders();
    res.render('admin/viewOrders',{ admin: true ,orders})
    } catch (error) {
        
    }
 }

//  module.exports.UpdateTrackOrder = (req,res)=>{
//   try {
//     console.log(req.params.id);
//     userHelpers.updateTrackOrder(req.params.id,req.params.order).then(()=>{
//     res.redirect('/admin/viewOrders/')
//     }) 
//   } catch (error) {
    
//   }
//   }

  module.exports.UpdateTrackOrder = (req,res)=>{
    try {
      userHelpers.updateTrackOrder (req.body.orderId,req.body.prodId,req.body.status).then((response)=>{
      res.json(response)
      }) 
    } catch (error) {
      
    }
    }
    
// <--------------------- Request Retun Page  -----------------------> */
    module.exports.requestReturnPage = async (req, res) => {
      userHelpers.returnProducts(req.params.id)
      let id = req.params.id;
      res.render('users/returnForm', { user: true, id })
    }

// <--------------------------- put  Cancel Order -----------------------> */
    module.exports.cancelOrderdProduct = async (req, res) => {
      let orderId = req.body.orderId;
      let prodId = req.body.prodId;
      let status = "canceled";
      userHelpers.updateTrackOrder(orderId, prodId, status).then((response) => {
        res.json(response)
      })
    }

// <-------------------------- Return Ordered Product --------------------> */
    module.exports.returnOrderProduct = async (req, res) => {
      let orderId = req.body.orderId;
      let prodId = req.body.prodId;
      let status = "return requested";
      message = {
        reason: req.body.reason,
        discription: req.body.freeform
      }
      userHelpers.updateTrackOrder(orderId, prodId, status, message).then((response) => {
        res.json(response)
      })
    }
// <-------------------------- Return Request Page  ----------------------> */
    module.exports.returnRequestPage = async (req, res) => {
      cartCount = req.session.cartCount;
      userDetails = req.session;
      prodId = req.params.prodId;
      orderId = req.params.orderId;
      let product = await userHelpers.findSigleProduct(prodId, orderId);
      product = product[0];
      res.render('users/returnOrder', { user: true, cartCount, userDetails, product })
    }
    
/* <---------------- Admin Return Requests Page  ---------------> */
    module.exports.returnOrderPageAdmin = async (req,res)=>{
      let orders = await userHelpers.getReturnOrder()
      console.log(orders);
      res.render('admin/returnOrders',{admin:true,orders})
      }

/* <---------------- Admin Sales Report Page  ---------------> */
      module.exports.salesReport = async (req,res)=>{
        let DailySalesforDownload = await productHelpers.getDailysSales();
        let MonthlySalesforDownload = await productHelpers.getMonthlySales(); 
        let YearlySalesforDownload = await productHelpers.getYearlySales(); 
        res.render('admin/salesReport',{admin:true,DailySalesforDownload,MonthlySalesforDownload,YearlySalesforDownload})
      }

      module.exports.returnOrderedProduct = async (req,res)=>{
        let orderId = req.body.orderId;
        let prodId = req.body.prodId;
        let status = "return approved";
        let refund = req.body.refund;
        let userId = req.body.userId;
        let message = null;
        userHelpers.updateTrackOrder (orderId,prodId,status,message,refund,userId).then((response)=>{
         res.json(response)
       })
    }