const { log } = require('debug/src/browser');
const express = require('express');
const session = require('express-session');
const { Db } = require('mongodb');
const { resolve } = require('promise');
const router = express.Router();
const productHelpers = require('../services/productHelpers')
const userHelpers = require('../services/userHelpers')

//________________________Declaration______________________________________________________

//<----------------get userLogin page-------------------> 
module.exports.userLoginPage = async function (req, res, next) {
    if (req.session.userLoggedIn) {
      res.redirect('/');
    }
    else {
      req.session.userDetails
      message = req.session.message
      userExist = req.session.userExist;
      invalidReferal = req.session.invalidReferal;
      if(userExist)
      {
        res.render("users/login", { err: req.session.err , message,userExist});
        req.session.userExist = null;
      }
      else if(invalidReferal)
      {
        res.render("users/login", { err: req.session.err , message,invalidReferal});
        req.session.invalidReferal = null;
      }
      else{
        res.render("users/login", { err: req.session.err , message})
      }
      res.render("users/login", { err: req.session.err , message,userExist})
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
    if(req.body.refferal)
    {
      let amount = parseInt(50);
      let refferalCode = await userHelpers.findRefferal(req.body.refferal,amount)
      if(refferalCode)
      {
        userHelpers.addUser(req.body)
        .then((result) => {
        if (result.status) { 
          req.session.userExist = false
          userHelpers.addWallet(result.id)
          userHelpers.addReferalMoney(result.id)
          req.session.message = true;
          res.redirect("/login")
        }
         else {
          req.session.userExist = true;
          req.session.a = true
          errorMail = result.message
          res.redirect('/login')
        }
     })
      }
      else{
        req.session.invalidReferal = true;
        res.redirect('/login')
      }
    }


    else{
      userHelpers.addUser(req.body)
      .then((result) => {
        if (result.status) { 
          req.session.userExist = false
          userHelpers.addWallet(result.id)
          req.session.message = true;
          res.redirect("/login")
        }
         else {
          req.session.userExist = true;
          errorMail = result.message
          res.redirect('/login')
        }
     })
    }
  }

   /* <---------------------- Get Log Out -----------------------> */
  module.exports.logOut = async function (req, res) {
    req.session.user = null;
    req.session.userLoggedIn = false ;
    req.session.cartCount = null;
    res.redirect('/')
 }