const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const MONGODB_URI = `mongodb+srv://superkingsashish:${encodeURIComponent('Ashishb18')}@cluster0.27sicvx.mongodb.net/appledatabase2?retryWrites=true&w=majority` ;
const app = express();
const store = new MongoDBStore({
    uri : MONGODB_URI,
    collection : 'sessions',
});
//IMPORTING ROUTES

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require('./models/user');

// User.create({email: "admin@example.com", password: "abcd"});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use('/uploads/images', express.static("uploads/images"));   // image ko publbic dekha ya jyh
app.use(session({
     secret: "It is a secret key",
     resave:false,
     saveUninitialized: false,
     store : store,
}));

app.use(flash());          //720 - 57:00

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn ;
    res.locals.username = req.session.username ;
    res.locals.isAdmin = req.session.role == 'admin' ? true : false ;
    if (!req.session.isLoggedIn){
        return next();
    }
    User.findById(req.session.user)
    .then((user) => {
        req.user = user ;
        next();
    })
    .catch((err) => console.log(err));
});


app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// app.use(get404);

mongoose
.connect(MONGODB_URI)
.then(()=>{
    app.listen(2000,'localhost', ()=>{
        console.log('Server listening on 2000') ;
    });
})
.catch(err => console.log(err));




