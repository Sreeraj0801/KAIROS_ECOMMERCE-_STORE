const productHelpers = require('../services/productHelpers')


// <---------------------------- Get singleProduct page ------------------->
module.exports.userSingleProductsPage = async function (req, res, next) {
    productHelpers.getProductDetails(req.params.id).then((product)=>{ 
      if(req.session.userLoggedIn)
      {
        userDetails = req.session ;
        cartCount = req.session.cartCount;
        res.render('users/singleProduct', { user:true ,userDetails ,cartCount, product:product[0] });
      }else{
        res.render('users/singleProduct', { user:true, product:product[0] });
      }
    })
  }
// <---------------------------- Get All Product page ------------------->
  module.exports.userAllProducts = async (req,res)=>{
    productHelpers.getAllProduct().then((products)=>{
      productHelpers.getAllCategoryBrands().then((data)=>{
        userDetails = req.session;
        cartCount = req.session.cartCount;
        if(req.session.userLoggedIn)
        {
          res.render('users/product',{user:true,products,data,cartCount,userDetails});
        }
        else{
          res.render('users/product',{user:true,products,data});

        }
      })
    })
    }

// <------------------------- Admin Get View Product page ---------------->
module.exports.viewProdutsPage = async function (req, res, next) {
  productHelpers.getAllProduct().then((products) => {
    res.render('admin/viewProducts', { admin: true, products});
  })
}

// <----------------- Admin Add Products page -----------------------------> 
module.exports.addProductsPage =  async function (req, res, next) {
  productHelpers.getAllCategoryBrands().then((response) => {
    res.render('admin/addProducts', { admin: true, response });
  })
}
// <------------------ Admin Add Products  --------------------------------> 
module.exports.addProducts =async (req, res, next) => {
  const files = req.files;
  console.log(files);
  const fileName = files.map((file)=>{
    return file.filename;
  })
  const product = req.body;
  product.image = fileName;
  productHelpers.addProduct(product).then((id) => {
    res.redirect("/admin/viewProducts");
  })
}

// <----------------- Admin Edit Products Page ---------------------------> 
module.exports.editProductsPage =  async function (req, res, next) {
  productHelpers.getProductDetails(req.params.id).then((product) => {
    productHelpers.getAllCategoryBrands().then((data) => {
      productHelpers.editCategory(product[0].category).then((category) => {
        productHelpers.editBrand(product[0].brand).then((brand) => {
          res.render('admin/editProducts', { admin: true, product: product[0], data, category, brand });
        })
      })
    })
  })
}

// <----------------- Admin Put Edit Products  ---------------------------> 
module.exports.editProducts = async (req, res) => {
  let id = req.params.id
  productHelpers.updateProduct(req.params.id, req.body).then((response) => {
    res.redirect('/admin/viewProducts')
    if (req.files.image) {
      let image = req.files.image
      image.mv('./public/productImages/' + id + '.jpg')
    }
  })
}

// <------------------- Admin Delete Products  --------------------------> 
module.exports.deleteProducts = async (req, res) => {
  let productId = req.params.id
  productHelpers.deleteProduct(productId).then((response) => {
    res.redirect("/admin/vieWProducts")
  })
}


// <-------------------- Admin Update Stock -----------------------------> 
module.exports.stockUpdate = async function(req,res) {
  productHelpers.stockUpdate(req.params.id,req.body).then(()=>{
    res.redirect('/admin/viewProducts')
  })  
}