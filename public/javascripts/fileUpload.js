const multer = require('multer');

//<-----------------For Product Images ----------->
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

//<-----------------For Brand  Images ----------->
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

//<-----------------For category Images ----------->
const storage2 = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"public/pictures/categoryImages")
    },
    filename : function(req,file,callback){
        callback(null,file.originalname+'-'+Date.now())
    }
})
const uploadCategory =  multer({
    storage : storage2
})




//<-----------------Module Exporting  ----------->
module.exports = {
    upload , uploadBrand,uploadCategory
}