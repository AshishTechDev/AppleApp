const express = require('express');
const router = express.Router();
const { getIndex, getCart,
     addToCart,deleteItemInCart,
      updateCart ,getAddresses,addAddress,
       postCheckout, getCheckoutSuccess, getCheckoutCancel,
       getOrderInvoice, getOrders, getDetails, getAirPods,
      getIPhones, getIMacs, getIPads, getiPhone12}
       = require("../controllers/shop");


const isAuth = require("../middlewares/is-Auth");

router.get("/",getIndex);
router.get("/Details/:id", getDetails);
router.get("/AirPods", getAirPods);
router.get("/iPhones", getIPhones);
router.get("/iPads", getIPads);
router.get("/iMacs", getIMacs);
router.get("/iPhone12", getiPhone12);


router.get("/cart", isAuth,  getCart);
router.get("/addToCart/:id", isAuth,  addToCart);
router.delete("/delete-item-in-cart/:id", isAuth,  deleteItemInCart);
router.patch("/updateCart", isAuth,  updateCart);
router.get("/address", isAuth,  getAddresses);
router.post("/addAddress", isAuth, addAddress);

router.post("/checkout", isAuth, postCheckout);

router.get("/checkout/success", isAuth, getCheckoutSuccess);
router.get("/checkout/cancel", isAuth, getCheckoutCancel);


router.get("/orders", getOrders);
router.get("/orders/:orderId", isAuth, getOrderInvoice);

module.exports = router;


