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
  productHelpers.addCategory(req.body).then((id)=>{
    let image = req.files.image
    image.mv('./public/categoryImages/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/admin/viewCategory')
      }
      else {
        console.log(err);
      }
    })
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
  productHelpers.updateCategory(req.params.id, req.body).then((response) => {
    res.redirect('/admin/viewCategory')
    if(req.files.image){
      let image = req.files.image
      image.mv('./public/categoryImages/' + id + '.jpg')
    }
  })
}

/* <------------------  Post Delete Category Page -----------------> */
module.exports.deleteCategory = async (req, res) => {
  productHelpers.deleteCategory(req.params.id).then(() => {
    res.redirect('/admin/viewCategory')
  })
}

