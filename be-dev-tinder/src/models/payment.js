const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Mongoose _id
        ref: "User", // referring to the user model, so that we can use populate to get the user details
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    orderAmount: {
        type: Number,
        required: true,
    },
    orderCurrency: {
        type: String,
        required: true,
    },
    customerDetails: {
        type: Object,
        required: true,
    },
    orderMeta: {
        type: Object,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "PENDING",
    }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
