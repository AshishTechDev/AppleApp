const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const { validationResult } = require("express-validator");


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "bhandariashish2022@gmail.com",
        pass : "isztchmauxuutfod",
    },
});

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle : "Login",
        path : "/login",
        errorMessage : req.flash("error") ,

});
};

exports.postLogin = async (req, res, next) => {
   const { email, password } = req.body ;
   const user = await User.findOne({ email: email }) ;
   console.log(user);
   if(!user){
            req.flash("error", "Invalid username or password");
            return res.redirect("/login") ;
   }
   try {
       const doMatches = await bcrypt.compare(password, user.password);
        if(doMatches){
            // res.setHeader("Set-Cookie","isLoggedIn=true");
            req.session.isLoggedIn = true ;
            req.session.user = user._id ;
            req.session.role = user.role ;
            req.session.username = user.username ;
            req.session.save(() => {
                return res.redirect("/");
            });
        } else {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }
    } catch (e) {console.log("Internal Server Error");
  }
};

exports.getSignup = (req, res, next) =>{
    res.render("auth/signup", {
        pageTitle : "Sign Up",
        path : "/signup",
        errorMessage : req.flash("error") ,
    });
};

exports.postSignup = async (req, res, next) =>{
    const { username, email, password } = req.body ;

    const errors = validationResult(req);


    //1) check email already exists in database or not
     const user =  await User.findOne({ email: email }) ;
     if(user){
        req.flash("error", "You already have an account!");
        return res.redirect("/signup") ;
     }

     // check password
     console.log(errors);
     if(!errors.isEmpty()){
        return res.render("auth/signup", {
            pageTitle : "Sign Up",
            path : "/signup",
            errorMessage : errors.array()[0].msg ,
        });
     }

     //2) Encrypt password
     try{
          hashedpassword = await bcrypt.hash(password, 12);
         console.log(hashedpassword);

     }catch(err){
            console.log("unable to encrypt password");
            return next(err);
        }
    // 3) Store the email and password in the database
    try {

        const users = await User.find();
        if(users.length == 0) {
            const user = await User.create({
                username: username, 
                email : email,
                 password : hashedpassword,
                 role : 'admin',
            })
        } else {
            const user = await User.create({ 
                username: username,
                 email : email,
                  password : hashedpassword,
                  role : 'user',
                }) ;
        }
    } catch(err) {
        console.log("unable to encrypt password");
        return next(err);
    }

    //4)Send an email to the user on successfully signup
    //isztchmauxuutfod
    try {
        const mailSent = await transporter.sendMail({
            from: "bhandariashish2022@gmail.com",
            to: email,
            subject: "Signup Sucessfully",
            html: `<div>
            <h1>You have successfully Signup</h1>
                <p>Dear ${username}, you have successfully Signup your account in Apple.com</p>
                <img src="https://img.freepik.com/premium-vector/successful-beard-businessman-character-gives-thumb-up-successful-man-smile-finger-agreement_573689-518.jpg?w=2000" height="400px" width="600px" />
                <span>thanks for registration in apple.com</span>
            </div>`,
        });
        if(mailSent) {
            res.redirect("/login") ;
        }

    } catch(err) {
        console.log("unable to send email");
        return next(err);
    }
};

exports.getReset = (req, res, next) => {
    res.render("auth/reset", {
        pageTitle : "Reset Password",
        path : "/reset",
        errorMessage : req.flash("error") ,

    });
}

exports.postReset = async (req, res, next) => {
    const email = req.body.email;
    console.log(email);
    const user = await User.findOne({ email : email});

      if(!user){
        req.flash("error", "User not found");
        return res.redirect("/reset") ;
     }

    crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            console.log(err);
            return ;
        }
       const token = buffer.toString("hex") ;  // by using hex we will encode
       console.log(token);
       user.resetToken = token;
       user.resetTokenExpiration = Date.now() + 3600000;
       user.save().then(() => {
            return  transporter.sendMail({
                from: "bhandariashish2022@gmail.com",
                to: email,
                subject: "Reset Your Password",
                html: `<div>
                <h1>You have requested for Password Reset</h1>
                <p>Click on this <a href='http://localhost:2000/reset/${token}'  >link</a>  to update your password</p>
                </div>`,
            });
       }).then(()=> {
            res.redirect("/reset");
       })
       .catch(err => { console.log(err); });
    })
};

exports.getNewPassword = async (req, res, next) => {
   const token = req.params.token ;
   console.log("token received");
   console.log(token);
   const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
   });
   console.log(user._id);
   console.log("user is rec");
   if(!user){
    req.flash("error", "Session Timeout");
    return res.redirect("/reset");
   }
   res.render("auth/new-password", {
    pageTitle : "Update Password",
    path : "/login",                         //   1:19:00  -- 717
    token : token,
    userId: user._id,
    errorMessage: req.flash("error"),
   });
}
exports.postNewPassword = async (req, res, next) => {

    const { password, token, userid } = req.body ;
    console.log(password, token, userid);

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration : { $gt: Date.now() },
    });

    if(!user){
        req.flash("error", "Session Timeout!");
        return res.redirect("/reset");
    }
    let hashedPassword ;
    try {
        hashedPassword = await bcrypt.hash(password, 12) ;
    } catch(err){
        console.log("unable to encrypt password");
        return next(err);
    }
    
    try{
        await User.findByIdAndUpdate(userid, {
            password : hashedPassword,
            resetToken : null,
            resetTokenExpiration : null,
        });
        res.redirect("/login");
    } catch(err) {
        console.log("unable to update password");
        return next(err);
    }
}
exports.postLogout = (req, res,next) => {
    req.session.destroy(() => {
            res.redirect("/login");
        });
}
