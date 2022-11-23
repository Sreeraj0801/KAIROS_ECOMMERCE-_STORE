//requiring config files
const dotenv = require('dotenv').config();

const { log } = require('debug/src/browser');
//Helpers
const userHelpers = require('../services/userHelpers')
//otp twelio
const client = require('twilio')(process.env.TWELIO_SID_KEY,process.env.TWELIO_SECRET_KEY)

//Declaration
let phonenumber
let otpMessage
let OTPmessage
let OTPphonenumber


 /* <---------------------- get PhoneLogin Page -----------------------> */
 module.exports.phoneLoginPage = async (req,res)=>
 {
   res.render('users/phoneLogin',{otpMessage})
   otpMessage = "" ;
 }

 /* <---------------------- Post PhoneLogin Page - SendCode  -----------------------> */
 module.exports.phoneLogin = async (req,res) => {
    phonenumber = req.body.phonenumber
    userHelpers.checkPhoneNumber(req.body).then((response)=>{
      if(response.status)
      {  
        client.verify 
        .services (process.env.TWELIO_SERVICE_ID) // Change Service ID
        .verifications.create({
        to: `+91${req.body.phonenumber}`,
        channel:"sms",
        })
        .then((data) => {
          req.session.user = response.user
          res.redirect('/otpLogin');
      });
      }
      else{
             otpMessage =   response.message;
             res.redirect('/phoneLogin');
      }
    })
  }

   /* <---------------------- Get Otp Login page -----------------------> */
   module.exports.otpLoginPage = async (req,res)=>{
    if (req.session.userLoggedIn)
    {res.redirect('/')}
    else
    res.render('users/otpLogin',{OTPmessage})
    OTPmessage = ""
  }

  
 /* <---------------------- Post Resend Otp -----------------------> */
  module.exports.resendOtp = async (req,res) => {
    client.verify 
    .services (process.env.TWELIO_SERVICE_ID) // Change Service ID
    .verifications.create({
    to: `+91${phonenumber}`,
    channel:"sms",
    })
    .then((data) => {
      phonenumber = phonenumber
      res.json({})
  })
}

// <------------------------ Post Otp Login - Verify  ----------------->
module.exports.otpLogin = async  (req, res) => {
  console.log(phonenumber);
    client.verify
      .services(process.env.TWELIO_SERVICE_ID) // Change service ID
      .verificationChecks.create({
        to: `+91${phonenumber}`,
        code: req.body.code,
      })
      .then((data) => {
        if (data.status === "approved") {
          userHelpers.userDetails(phonenumber).then((resolve)=>{
            user1 = resolve
          })
          req.session.userLoggedIn = true
          res.redirect('/')
        } else {
          OTPmessage = "Invalid OTP!!"
          res.redirect("/otpLogin")
        }
      });
  }


  module.exports.forgetPhone = async (req,res)=>{
    userHelpers.findMobile(req.body.phonenumber).then((response)=>{
      if(response.status)
      {
        phonenumber = req.body.phonenumber;
        client.verify 
        .services (process.env.TWELIO_SERVICE_ID) // Change Service ID
        .verifications.create({
        to: `+91${req.body.phonenumber}`,
        channel:"sms",
        })
        .then((data) => {
          req.session.user = response.user
          res.json({otp:true})
      });
      }
      else{
        res.json(response)
      }
      
    })
  }

  module.exports.forgetOtp = async  (req, res) => {
    client.verify
      .services(process.env.TWELIO_SERVICE_ID) // Change service ID
      .verificationChecks.create({
        to: `+91${phonenumber}`,
        code: req.body.code,
      })
      .then((data) => {
        if (data.status === "approved") {
          userHelpers.userDetails(phonenumber).then((resolve)=>{
            user1 = resolve
          })
          req.session.phonenumber = phonenumber;
          res.json({verify:true})
        } else {
          res.json({invalidOtp:true})
          
        }
      });
  }