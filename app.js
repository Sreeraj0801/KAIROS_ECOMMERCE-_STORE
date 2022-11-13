const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs')
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const Cropper = require('cropperjs')

const app = express();
const multer = require('multer');            
const db = require('./config/connection')
const session = require('express-session')
const nocache = require('nocache')
const dotenv = require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname+'/views/partials/')
// app.engine('hbs',hbs.engine({extname : 'hbs',defaultLayout : 'layout',layoutsDir: __dirname+'/views/' , partialsDir : __dirname + '/views/partials/'}))
app.use(nocache())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "key", saveUninitialized :true , resave : false , cookie: { maxAge:9000000 } }))
hbs.registerHelper('plusOne',(number)=>{
  return parseInt(number)+1
})
hbs.registerHelper('stockOut',(value)=>{
  return value <= 0 ? true : false
})

hbs.registerHelper('cancel', (value)=>{
  return value == "canceled" ? true: false
})
hbs.registerHelper('delivered', (value)=>{
  return value == "Deliverd" ? true: false
})

hbs.registerHelper('multiply',(value,value2)=>{
  return  (parseInt(value) * parseInt(value2))
})

hbs.registerHelper('walletStatus',(value)=>{
  return  value <= 0 ? true : false
})


/*Monog Db connect*/
db.connect((err)=>{
  if(err)
  {console.log("Connnection Error"+err);}
  else
  console.log("Database Connected to port 2701");
})

app.use('/admin', adminRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
