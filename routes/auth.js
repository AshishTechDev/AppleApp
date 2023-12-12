const express = require("express");
const router = express.Router();

const {
    getLogin,postLogin,
    getSignup, postSignup, postLogout, getReset, postReset, getNewPassword, postNewPassword 
  } = require("../controllers/auth");

const { body, check } = require("express-validator");


  router.get("/signup", getSignup);
  router.post("/signup",
    check("email").notEmpty().isEmail().withMessage("Invalid Email-Id"),
    body("password" , "Invalid Password").matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$#@]).{8,24}$/),
    //we can write msg inside the body()           
    body("confirmPassword").custom((value, { req})=> {
        if(value !== req.body.password){
          throw new Error("Password do not match");
        }
        return true;
    }),
   postSignup
   );
  router.get("/login", getLogin);
  router.post("/login", postLogin);
  router.get("/logout", postLogout);
  router.get("/reset", getReset);
  router.post("/reset", postReset);
  router.get("/reset/:token", getNewPassword);
  router.post("/new-password", postNewPassword);

  module.exports = router;
