const { log } = require('debug/src/browser');
var productHelpers = require('../services/productHelpers');


// <--------------------------- Get Brand page ----------------->
module.exports.userBrand = async function (req, res, next) {
    res.render('users/category', { user: true });
  }

// <------------------------ Admin Add  Brand page --------------->
  module.exports.addBrandsPage =  async function (req, res, next) {
    res.render('admin/addBrand', { admin: true });
  }
// <------------------------ Post Admin  Brand page -------------->
  module.exports.addBrand =  (req, res) => {
    const files = req.body;
    files.image = req.files[0].filename;
    productHelpers.addBrand(files).then(() => {
      res.redirect('/admin/viewBrand')
    })
  }
  

// <------------------------ Admin View Brand page --------------->
  module.exports.viewBrand = function (req, res, next) {
    productHelpers.getAllBrand().then((brand) => {
      res.render('admin/viewBrand', { admin: true, brand });
    })
  }
 // <------------------------ Admin Edit Brand page --------------->
  module.exports.editbrandPage = async (req, res) => {
    productHelpers.editBrand(req.params.id).then((brand) => {
      res.render('admin/editBrand', { admin: true, brand })
    })
  }

 // <------------------- Post Admin Edit Brand page --------------->
  module.exports.editBrand = async(req, res) => {
    brand = await productHelpers.getBrand(req.params.id);
    if(req.files != 0)
    {
      var files = req.body;
      files.id = req.params.id
      files.image = req.files[0].filename;
    }
    else{
      var files = req.body;
      files.id = req.params.id;
      files.image = brand.image;
    }

    productHelpers.updateBrand(files).then(() => {
      res.redirect('/admin/viewBrand')
    })
  }

 // <----------------- Post Admin Delete Brand page --------------->
  module.exports.deleteBrand = async (req, res) => {
    productHelpers.deleteBrand(req.params.id).then(() => {
      res.redirect('/admin/viewBrand')
    })
  }