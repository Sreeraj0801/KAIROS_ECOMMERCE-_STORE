const session = require('express-session')
const productHelpers = require('../helpers/productHelpers')
const userHelpers = require('../helpers/userHelpers')

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
      userHelpers.updateTrackOrder (req.body.id,req.body.status).then((response)=>{
      res.json(response)
      }) 
    } catch (error) {
      
    }
    }

  
