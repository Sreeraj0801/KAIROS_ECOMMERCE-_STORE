
const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect = function (done) {
    const url = 'mongodb+srv://kairos:kairos@cluster0.wolxfcl.mongodb.net/test'
    const dbname = 'kairos'

    mongoClient.connect(url, (err, data) => {
        if (err)
            return done(err)
        state.db = data.db(dbname)
        done()
    })

   
}
module.exports.get=function(){
    return state.db
}

