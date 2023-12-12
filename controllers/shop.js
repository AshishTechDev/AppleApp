const stripe = require('stripe')("sk_test_51NahYOSGQGcMg3IonQtF3GNRjQvD4gXpeC251JsU0MLD08bYPazAoziN3CFXeCXaXUgexlxLYy8bJKYJ5m0fFCIN00Txnj6arj");

const path = require("path");
const fs = require("fs");
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');


exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/index", {
      pageTitle: "Shop",
      path: "/",
      products : products.reverse(),
    });
    } catch(err) {
        console.log(err.message);
    }
  }

exports.getDetails = async (req, res, next) => {
 const {id} = req.params ;
 try {
   const product = await Product.findById(id);
   res.render("shop/product-detail", {   // go to this ejs page
     path: "/product-detail", 
     pageTitle: product.title,
     category: product.category,
     product: product,
   })
 } catch (err) {
  console.log(err.message);
  }

 
}

exports.getCart =  async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.productId") ;
  // user database k andar cart ha, usmy product id ha, toh populate
    // ki help sy hum product ka data hum nikal lygyh
    // console.log(user.cart);
    // console.log("cart ki details");
      const products = user.cart ;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products : products ,
      });
  } catch(err) { 
    console.log(err.message) ;
  }
};
exports.addToCart = async (req, res, next) => {
 const prodId = req.params.id ;
    try {
   const response = await req.user.addToCart(prodId);            //req.user is object of class userSchema
      res.redirect("/cart") ;
    } catch(err) {
      console.log(err.message);
   }

};

exports.deleteItemInCart = async (req, res, next) => {
  const { id } = req.params ;
  try{
    const response = await  req.user.removeFromCart(id) ;
    const user = await response.populate("cart.productId");
    const updatedCart = user.cart ;
    res.send(updatedCart);
  } 
  catch(err) { console.log(err.message);}
}



exports.updateCart = async (req, res, next) => {
  try {
    const response = await req.user.updateCart(req.body.qty, req.body.prodId);
    const product = response.cart.find((p)=> {
      return p.productId.toString() === req.body.prodId ;
    });

    res.send({ updateQty : product.quantity }) ;
  } catch(err) { 
    console.log(err.message); 
  }
};

exports.getAddresses = async (req, res, next) => {
  const addresses = req.user.address ;
  res.render("shop/address", {
    path: "/address",
    pageTitle: "Address ", 
    addresses : addresses   //now watch 715
  });
}

exports.addAddress = async (req, res, next) => {
    console.log(req.body);
    console.log("address added");
    try {
      const response = await req.user.setAddress(req.body);
      res.redirect("/address");
    } catch (err) {
      console.log(err.message);
    }
}

exports.getAirPods = async (req, res, next) => {
    try {
      const products = await Product.find({category: "AirPods"});
      res.render("shop/categoryProduct", {
          pageTitle: "AirPods Products",
          path: "/AirPods",
          products: products,
      });
    } catch (err) {
      console.log(err.message);
     }
}

exports.getIPhones = async (req, res, next) => {
  try {
    const products = await Product.find({category: "iPhone"});
    res.render("shop/categoryProduct", {
        pageTitle: "iPhone Products",
        path: "/AirPods",
        products: products,
    });
  } catch (err) {
    console.log(err.message);
   }
}
exports.getIPads = async (req, res, next) => {
  try {
    const products = await Product.find({category: "iPad"});
    res.render("shop/categoryProduct", {
        pageTitle: "iPad Products",
        path: "/AirPods",
        products: products,
    });
  } catch (err) {
    console.log(err.message);
   }
}

exports.getIMacs = async (req, res, next) => {
  try {
    const products = await Product.find({category: "iMac"});
    res.render("shop/categoryProduct", {
        pageTitle: "iMac Products",
        path: "/AirPods",
        products: products,
    });
  } catch (err) {
    console.log(err.message);
   }
}

exports.getiPhone12 = async (req, res, next) => {
  try {
    let iphone12 = [] ;
    const products = await Product.find({ category: "iPhone"});
    products.forEach(function(product) {
    if(product.title.includes("12")){
        iphone12.push(product) ;
      }
    })
    res.render("shop/categoryProduct", {
      pageTitle: "iPhone 12",
      path: "/iPhone12",
      products: iphone12,
    });
  } catch (err) {
    console.log(err.message);
   }
}

exports.getOrders = async (req, res, next) => {
  
  const orders = await Order.find({userId: req.user.id});
 
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Orders",
      orders: orders,
    });
};

exports.getOrderInvoice = async (req, res, next) => {
  const orderId = req.params.orderId ;
  const invoiceName = "Invoice-" + orderId + ".pdf" ;
  const invoicePath = path.join(
    __dirname,
    '..',
    "data",
    "invoices",
    invoiceName 
  );

  const pdfDoc = new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.fontSize(24).text("Invoice", {
    underline: true,
  });
  pdfDoc.text("-----------------");
  const order = await Order.findById(orderId);
  let totalPrice = 0 ;  
  order.products.forEach((prod)=>{
    totalPrice += prod.quantity * prod.product.price ;
    pdfDoc.fontSize(14).text(
      prod.product.title + " - " + prod.quantity + " x " + prod.product.price
    );
  });
  pdfDoc.text("---");
  pdfDoc.fontSize(20).text("Total Price: Rs" + totalPrice);

  pdfDoc.end();

  const file = fs.createReadStream(invoicePath);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Dispostion", "inline: filename=" + invoiceName);
  file.pipe(res);
};

exports.postCheckout = async (req, res, next) => {
  const addressId = req.body.addressId ;

    let total = 0 ;
    try {

      const user = await req.user.populate("cart.productId");
      const products = user.cart ;
      products.forEach((p)=> (total += p.quantity * p.productId.price));

      const session = await stripe.checkout.sessions.create({
        line_items: products.map((p) => {
            return {
              price_data: {
                currency: "INR",
                product_data : {
                  name: p.productId.title,
                  description: p.productId.description,
                },
                unit_amount: p.productId.price * 100,
              },
              quantity : p.quantity,
            };
        }),
        mode: "payment",
        success_url: "http://localhost:2000/checkout/success?addressId=" + addressId + "&total=" + total ,
        cancel_url: "http://localhost:2000/checkout/cancel",
      });
        res.redirect(303, session.url);
    } catch (e) {
      console.log(e.message);
    }
};

exports.getCheckoutSuccess = async (req, res, next) => {
  const addressId = req.query.addressId ;
  const total = req.query.total ;
  const address = req.user.address.find((address) => address._id.toString() === addressId) ;

  var d = new Date();
  d.setDate(d.getDate() + 4);
  var updatedDate = d.toString().slice(0,15); 

  console.log("New date is "+ updatedDate);
  try {
    const user = await req.user.populate("cart.productId") ;
    const products = user.cart.map((p)=> {
      return { quantity: p.quantity, product: { ...p.productId }};
    })
    // console.log(products);
  

    const order = new Order({
          products: products,
          address: address,
          userId : req.user._id.toString(),
          Delivery: updatedDate,
          total : total,
    });
    console.log("got order "+ order);
    await order.save();
    await req.user.clearCart();
    res.render("shop/checkout-success", {
      path: "checkout",
      pageTitle: "Order Confirmed",
      orderId : addressId,
    });
  } catch (e) {
    console.log(e.message);
  }
};

exports.getCheckoutCancel = (req, res, next) => {

    res.render("shop/checkout-cancel", {
        path : "/checkout",
        pageTitle: "Order Cancelled",

    })
}    