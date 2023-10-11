const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new mongoose.Schema(
    {
    products : [
        {
            product : {
                type : Object,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    address: {
        type: Object,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },   
    Delivery : {
        type: String,
        required: true,
    },
    total : {
        type: String,
        required: false,
    },
},
  { timestamps: true,}
);



module.exports = mongoose.model("Order", orderSchema);