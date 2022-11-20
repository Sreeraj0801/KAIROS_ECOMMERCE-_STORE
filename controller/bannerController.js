var productHelpers = require('../services/productHelpers');



/* <-----------------  Admin View Banner page ----------------> */
module.exports.viewBannerPage = async function (req, res, next) {
    productHelpers.getBanner().then((banner)=>{
      res.render('admin/viewBanner', { admin: true , banner});
    })
  }

/* <-----------------  Admin Add Banner page -----------------> */
module.exports.addBannerPage =  async function (req, res, next) {
    res.render('admin/addBanner', { admin: true });
  }

/* <-----------------  Admin Post Add Banner  ----------------> */
module.exports.addBanner = async (req,res)=>{
  const files = req.body;
  files.image = req.files[0].filename;
    productHelpers.addBanner(files).then((id)=>{
          res.redirect('/admin/viewBanner')
    })
  }


/* <-----------------  Admin Edit Banner  ---------------------> */
 module.exports.editBannerPage =  async function (req, res, next){
    productHelpers.editBanner(req.params.id).then((banner)=>{
      res.render('admin/editBanner', { admin: true ,banner});
    })
  }

  /* <-----------------  Admin Put Edit Banner  ------------------> */
  module.exports.editBanner = async (req,res)=>{
    let id = req.params.id
    banner = await productHelpers.findBanner(id);
    if(req.files !=0)
    {
      var files = req.body;
      files.id = req.params.id;
      files.image = req.files[0].filename;
    }
    else{
      var files = req.body;
      files.id = req.params.id;
      files.image = banner.image;
    }
    productHelpers.updateBanner(req.params.id,files)
      res.redirect('/admin/viewBanner')
  }


 /* <-----------------  Admin Delete Banner  ------------------> */
  module.exports.deleteBanner = async (req, res) => {
    productHelpers.deleteBanner(req.params.id).then(() => {
      res.redirect('/admin/viewBanner')
    })
  }