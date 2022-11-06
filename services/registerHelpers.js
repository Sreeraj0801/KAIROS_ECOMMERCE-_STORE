module.exports = {
    multiply : ()=>{
        hbs.registerHelper('multiply',(value,value2)=>{
            return  (parseInt(value) * parseInt(value2))
          })
    }
}