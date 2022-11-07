//requiring config files
const dotenv = require('dotenv').config();

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
        console.log(response.message);
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
    to: `+91${OTPphonenumber}`,
    channel:"sms",
    })
    .then((data) => {
      phonenumber = OTPphonenumber
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
          // res.status(200).send({
          //   message: "User is Verified!!",
          //   data,
          // });
          req.session.userLoggedIn = true
          res.redirect('/')
        } else {
          OTPmessage = "Invalid OTP!!"
          res.redirect("/otpLogin")
          
        }
      });
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
          // res.status(200).send({
          //   message: "User is Verified!!",
          //   data,
          // });
          res.redirect('/changePword')
        } else {
          OTPmessage = "Invalid OTP!!"
          res.redirect("/otpLogin")
          
        }
      });
  }