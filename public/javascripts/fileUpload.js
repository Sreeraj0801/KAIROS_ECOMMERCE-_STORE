const multer = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,public/pictures/productImages)
    },
    filename : function(req,file,callback){
        callback(null,file.orginalname+'-'+Date.now())
    }
})

const upload =  multer({
    storage : storage
})

module.exports = {
    upload
}