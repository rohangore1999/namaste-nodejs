const express = require("express");
const paymentRouter = express.Router();
const Cashfree  = require("../utils/cashfree");

// Middleware
const { userAuth } = require("../middlewares/auth");

paymentRouter.post("/payment/create-order", userAuth, async (req, res) => {
  try {
    const request = {
      order_amount: 1,
      order_currency: "INR",
      customer_details: {
        customer_id: "walterwNrcMi",
        customer_phone: "9999999999",
      },
      order_meta: {
        firstName: "Walter",
        lastName: "White",
        return_url:
          "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}",
      },
    };

    const order = await Cashfree.PGCreateOrder("2023-08-01", request);

    console.log(order);

    res.json(order?.data);
  } catch (err) {
    console.error(err);
  }
});

module.exports = paymentRouter;
