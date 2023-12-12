const Product = require("../models/product");     //class
const { validationResult } = require("express-validator");
const fs = require("fs/promises");

exports.getAddProduct =  (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        span : "Add",
        editable : false,
        addable: true,
        errorMessage : req.flash("error") ,

    });
};

exports.postAddProduct = async (req, res, next) => {
    const { title, imageUrl, price, category, description, display, camera } = req.body ;

    console.log(req.file);
    console.log("file") ;

    const errors = validationResult(req);
    console.log(errors);
    if(!req.file){
        return  res.render('admin/edit-product', {
            pageTitle: "Add Product",
            path: "/admin/add-product",
            span : "Add",
            editable : false,
            addable: true,
            errorMessage : "Invalid file type" ,
            path : "imageUrl",
        });
     }

     if(!errors.isEmpty()){
        return  res.render('admin/edit-product', {
            pageTitle: "Add Product",
            path: "/admin/add-product",
            span : "Add",
            editable : false,
            addable: true,
            errorMessage : errors.array()[0].msg ,
            path : errors.array()[0].path,
        });
     }

 try {
     await Product.create({title, imageUrl : req.file.path , price, category, description, display, camera});
     res.redirect('/admin/products');
 } catch (err) {
    console.log(err.message);
 }
};              // 38:55 4th video 708

exports.getProducts = async (req, res, next) => {
    try {
    const products = await Product.find();
        res.render("admin/products", {
            pageTitle: "Admin Products",
            path: "/admin/products",
            products: products.reverse(),
        });
    } catch(err) {
        console.log(err.message);
    }
};

exports.getEditProduct = async (req, res, next) => {
    const {id} = req.params ;
    const editable = req.query.edit ;
    try {
       const product = await Product.findById(id) ;
    // console.log(product);
    res.render('admin/edit-product', {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        span : "Update",
        product : product,
        editable : editable,
        addable : false,
        errorMessage : req.flash("error") ,
    }) ;
    } catch (err) {
        console.log(err.message);
     }
}

exports.postEditProduct = async (req, res, next) => {

    const {title, price, category, description, display, camera, id} = req.body ;
    const product = await Product.findById(id);

        if(req.file){
            try {
                 await fs.unlink(product.imageUrl);
              } catch (err) {
                console.log("error deleting file" + err.message);
              }
        }

    try {
        await Product.findByIdAndUpdate(id, {title,
            imageUrl: req.file ? req.file.path : product.imageUrl
            , price, category, description, display, camera});  
        res.redirect('/admin/products');
     }
      catch (err) {
        console.log(err.message);
     }
  
};

        

exports.deleteProduct = async (req, res, next) => {
    const {id} = req.params ;

    const product = await Product.findById(id);

    console.log(product.imageUrl);

     fs.unlink(product.imageUrl, (err)=> {
        if(err){
            return ;
        }
             Product.findByIdAndDelete(id)
             .then(() => {
            res.redirect('/admin/products');
             })
             .catch((err) => console.log(err));
            });
        }