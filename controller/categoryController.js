const productHelpers = require('../services/productHelpers')


 /* <---------------------- Get Category Page -----------------------> */
 module.exports.userCategory = async function (req, res, next) {
    res.render('users/category', { user: true });
}

 /* <--------------------- Post Category Products Page --------------> */
 module.exports.userCategoryProducts = async (req,res)=>{
    productHelpers.getCategoryProducts(req.params.id).then((products)=>{
      res.render("users/categoryProducts",{user:true,products})
    })
  }

/* <--------------------- Get  Admin Add Category --------------------> */
module.exports.addCategoryPage = async function (req, res, next) {
  res.render('admin/addCategory', { admin: true });
}

/* <--------------------- Post Admin Add Category --------------------> */
module.exports.postAddCategoryPage = async (req, res, next) => {
  const files = req.body;
  files.image = req.files[0].filename;
  productHelpers.addCategory(files).then((id)=>{
    res.redirect('/admin/viewCategory')
  }) 
} 


/* <--------------------- Get View Category Page --------------------> */
module.exports.viewCategoryPage = async function (req, res, next) {
  productHelpers.getAllCategory().then((category) => {
    res.render('admin/viewCategory', { admin: true, category });
  })
}

/* <------------------------ Get EditCategory  ----------------------> */
module.exports.editCategory = async (req, res, next) => {
  productHelpers.editCategory(req.params.id).then((category) => {
    res.render('admin/editCategory', { admin: true, category })
  })
}

/* <----------------------- Post EditCategory  ----------------------> */
module.exports.postEditCategory = async (req, res) => {
  let id = req.params.id
  category =await productHelpers.getCategory(id);
  if(req.files != 0)
  {
    var files = req.body;
    files.id = req.params.id;
    files.image = req.files[0].filename;
  }
  else{
    var files = req.body;
    files.id = req.params.id;
    files.image = category.image
  }
  productHelpers.updateCategory(files).then((response) => {
    res.redirect('/admin/viewCategory')
  })
}

/* <------------------  Post Delete Category Page -----------------> */
module.exports.deleteCategory = async (req, res) => {
  productHelpers.deleteCategory(req.params.id).then(() => {
    res.redirect('/admin/viewCategory')
  })
}

