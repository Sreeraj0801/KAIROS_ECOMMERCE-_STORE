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
    productHelpers.addBanner(req.body).then((id)=>{
      let image = req.files.image
      image.mv('./public/bannerImages/' + id + '.jpg',(err,done) =>{
        if(!err){
          res.redirect('/admin/viewBanner')
        }
        else{
          console.log(err);
        }
      })
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
    productHelpers.updateBanner(req.params.id,req.body)
      if (req.files.bannerImage) {
  
        let image = req.files.bannerImage
        image.mv('./public/bannerImages/' + id + '.jpg')
      }
      res.redirect('/admin/viewBanner')
  }


 /* <-----------------  Admin Delete Banner  ------------------> */
  module.exports.deleteBanner = async (req, res) => {
    productHelpers.deleteBanner(req.params.id).then(() => {
      res.redirect('/admin/viewBanner')
    })
  }