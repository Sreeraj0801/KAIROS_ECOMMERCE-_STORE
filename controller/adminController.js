/* <----------------- #Declaring AdminName  Password Declaration -------------------> */
const check = {
    name: "admin@gmail.com",
    password: "admin"
  }

  let error;




/* <----------------- get login  page-------------------> */
module.exports.adminLoginPage = async function (req, res, next) {
    if (req.session.adminLoggedIn) {
      res.redirect('/admin/home')
    }
    else {
      res.render('admin/adminLogin', { error });
    }
    error = " "
  };


  /* <----------------- Post login  page-------------------> */
module.exports.postAdminLogin = async (req, res) => {
try {
    
  if (check.name == req.body.adminName && check.password == req.body.password) {
    req.session.adminLoggedIn = true

    res.redirect('/admin/home')
  }
  else {
    error = "Invalid Username or password"
    res.status(200).redirect("/admin")
  }
  
} catch (error) {
  res.status(500).send(error) 
}
  };

/* <----------------- signOut Root -------------------> */
module.exports.signout =  async function (req, res, next) {
    req.session.adminLoggedIn = false;
    res.redirect('/admin/home');
  }


