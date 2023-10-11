const express = require('express');
const router = express.Router();
const { getAddProduct, postAddProduct, getProducts, deleteProduct, getEditProduct,postEditProduct } = require('../controllers/admin');

const { body, check } = require("express-validator");


const isAuth = require("../middlewares/is-Auth");
const upload = require("../middlewares/file-upload");

router.use((req, res, next) => {
    if(req.session.role !== 'admin') {
        return res.redirect("/");
    }
    next();
});

router.get("/add-product", isAuth, getAddProduct);

router.post("/add-product", isAuth,
        upload.single("imageUrl")
,
[   
    body("title").notEmpty().isAlphanumeric().withMessage("title should be alphabets only"),
    check("price").notEmpty().isNumeric().withMessage("Please enter Numeric Keywords"),
    body("description").notEmpty().isLength({ min : 30, max: 500 }).withMessage("Description should not be shorter than 30 characters"),
],
postAddProduct
);

router.get("/products", isAuth,  getProducts);

router.get("/delete-product/:id",isAuth , deleteProduct);

router.get("/edit-product/:id", isAuth, getEditProduct);

router.post("/edit-product",
upload.single("imageUrl") ,
isAuth, postEditProduct);

module.exports = router ;