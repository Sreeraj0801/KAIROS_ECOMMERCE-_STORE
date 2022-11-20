const multer = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"public/pictures/productImages")
    },
    filename : function(req,file,callback){
        callback(null,file.originalname+'-'+Date.now())
    }
})

const upload =  multer({
    storage : storage
})


const storage1 = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"public/pictures/brandImages")
    },
    filename : function(req,file,callback){
        callback(null,file.originalname+'-'+Date.now())
    }
})

const uploadBrand =  multer({
    storage : storage1
})
module.exports = {
    upload , uploadBrand
}