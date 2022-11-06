const express = require('express');
const session = require('express-session');
const { resolve } = require('promise');
const router = express.Router();
const productHelpers = require('../helpers/productHelpers')
const userHelpers = require('../helpers/userHelpers')

//________________________Declaration______________________________________________________

//<----------------get userLogin page-------------------> 
module.exports.userLoginPage = async function (req, res, next) {
    if (req.session.userLoggedIn) {
      res.redirect('/');
    }
    else {
      req.session.userDetails
      message = req.session.message
      message1 = req.session.message1
      res.render("users/login", { err: req.session.err , message , message1})
      req.session.message = ""
      req.session.message1 = ""
      req.session.loginErr = false
      req.session.err = ""
    }
}

//<---------------Post userLogin page-------------------> 
module.exports.userLogin =  async (req, res) => {
    userHelpers.doLogin(req.body).then((response) => {
      req.session.userLoggedIn = response.loginStatus
      
      if (response.loginStatus && response.user.status) {
        req.session.user = response.user
        req.session.userLoggedIn = response.loginStatus
        console.log("LLLLLLLLLLLLLLLLLLL");
        console.log(req.session.userLoggedIn);
        res.redirect("/");
        error = " "
      }
      else {

        if(response.user.status == false && response.loginStatus == true)
        {
          req.session.loginErr = false
          req.session.userLoggedIn = false
          req.session.err =  "ACCOUNT BLOCKED"
          res.redirect("/login"); 
        }

        else {
        req.session.loginErr = false
        req.session.userLoggedIn = false
        req.session.err = "INVALID USERNAME OR PASSWORD"
        res.redirect("/login");
        }  
      }
    });
  }

 /* <---------------------- Post User SignUp -----------------------> */
  module.exports.signUp = async (req, res) => {
    userHelpers.addUser(req.body)
      .then((result) => {
        if (result.status) {    
          req.session.message = "Account Registerd Sucessfully"
          req.session.message1 = "please Login"
          res.redirect("/login")
        }
         else {
          errorMail = result.message
          res.redirect('/login')
        }
     })
  }

   /* <---------------------- Get Log Out -----------------------> */
  module.exports.logOut = async function (req, res) {
    req.session.user = null;
    console.log("{{{{{{{{{{{");
    console.log(req.session.userLoggedIn);
    req.session.userLoggedIn = false ;
    req.session.cartCount = null;
    res.redirect('/')
 }